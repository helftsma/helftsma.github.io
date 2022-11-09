export const getHistogram = async (
  centroids: any,
  counts: any,
  left_lim: number,
  right_lim: number
) => {
  const HISTOGRAM_CODE = `
import numpy as np
centroids = np.array(${centroids})
counts = np.array(${counts})
zoom_range = [${left_lim}, ${right_lim}]

def hist(
  *,
  centroids: np.array,
  counts: np.array,
  left_lim: float,
  right_lim: float,
  n_bins: int = 20
):
  """
  One-dimensional histogram via interpolation of centroids + counts information

  See t-digest paper for details
  """
  # Check number of dimensions
  assert len(centroids.shape) == 1, 'One-dimensional histogram must be called with 1d array of centroids'

  # We need to separate the singleton centroids from the rest and account for the singletons
  # specially, to improve the interpolation

  singleton_centroids = centroids[counts == 1]
  non_singleton_centroids = centroids[counts > 1]
  counts_non_singletons = counts[counts > 1]

  # Sort the non-singleton centroids and counts
  sort_order = np.argsort(non_singleton_centroids)
  non_singleton_centroids = non_singleton_centroids[sort_order]
  counts_non_singletons = counts_non_singletons[sort_order]

  # Determine the centroid edges of the regions spanned by each non-singleton centroid. Store these edges as
  # an array of size n_centroids + 1, accounting for
  # edges from the left edge of the first centroid to the right edge of the last centroid

  centroid_span_edges = np.zeros(non_singleton_centroids.shape[0] + 1)

  # The region spanned by a centroid is approximated as follows: For the middle centroids, the region
  # starts halfway between the
  # previous centroid and the current centroid and ends at halfway between the current centroid
  # and the next centroid

  centroid_span_edges[1:-1] = 0.5 * (non_singleton_centroids[1:] + non_singleton_centroids[:-1])

  # To determine the left-most edge of the first centroid's span,
  # we don't have a centroid preceding it and hence assume that it extends
  # the same length to the left as to the right
  #
  centroid_span_edges[0] = 2 * non_singleton_centroids[0] - centroid_span_edges[1]

  # To determine the right-most edge of the last centroid's span,
  # we don't have a centroid succeeding it and hence assume that it extends
  # the same length to the right as to the left
  #
  centroid_span_edges[-1] = 2 * non_singleton_centroids[-1] - centroid_span_edges[-1]

  # Get sizes of centroids' spans
  centroid_span_sizes = centroid_span_edges[1:] - centroid_span_edges[:-1]

  # Arrays to store the histogram results
  #
  hist_bin_edges = np.linspace(left_lim, right_lim, n_bins + 1)
  hist_counts = np.zeros(n_bins, dtype='int')

  # Determine the centroid spans cut by the histogram's bin edges
  centroid_spans_cut_by_hist_bin_edges = np.digitize(hist_bin_edges, centroid_span_edges)

  for indx in range(n_bins):

    left_bin_edge, right_bin_edge = hist_bin_edges[indx], hist_bin_edges[indx + 1]

    centroid_span_cut_by_left_edge = centroid_spans_cut_by_hist_bin_edges[indx]
    centroid_span_cut_by_right_edge = centroid_spans_cut_by_hist_bin_edges[indx + 1]

    if centroid_span_cut_by_right_edge == 0:
        # This means that the spans of all centroids lie entirely tot he right of the current bin
        # We can go to the next bin
        continue

    if centroid_span_cut_by_left_edge == centroids.shape[0] + 1:
        # This means the current bin has passed all centroids' spans. This holds true for the
        # subsequent bins as well, hence we can break the loop here
        break

    # Account for all the critical points within the bin, which includes the bin edges and the edges of
    # any centroid spans falling within the bin
    last_point_crossed = left_bin_edge

    for span_indx in range(centroid_span_cut_by_left_edge, centroid_span_cut_by_right_edge):
        next_point_crossed = centroid_span_edges[span_indx]

        if span_indx > 0:
            hist_counts[indx] += (
                counts_non_singletons[span_indx - 1]
                * (next_point_crossed - last_point_crossed) / centroid_span_sizes[span_indx - 1]
            )

        last_point_crossed = next_point_crossed

    last_span_indx = centroid_span_cut_by_right_edge

    if last_span_indx < centroids.shape[0] + 1:
        hist_counts[indx] += (
            counts_non_singletons[last_span_indx - 1]
            * (right_bin_edge - last_point_crossed) / centroid_span_sizes[last_span_indx - 1]
        )

  # Add singleton centroids to the corresponding bins
  singleton_centroid_positions_relative_to_bin = np.digitize(singleton_centroids, hist_bin_edges)

  for relative_pos_indx in singleton_centroid_positions_relative_to_bin:
    if 0 < relative_pos_indx < n_bins:
        hist_counts[relative_pos_indx] += 1

  return hist_bin_edges, hist_counts

bins, counts = hist(centroids=centroids.flatten(), counts=counts, left_lim=zoom_range[0], right_lim=zoom_range[1])
`;

  await globalThis.pyodide.loadPackage('numpy');

  globalThis.pyodide.runPython(HISTOGRAM_CODE);

  const ranges = Object.values(globalThis.pyodide.globals.get('bins').toJs());
  const values = Object.values(globalThis.pyodide.globals.get('counts').toJs());

  return [ranges, values];
};
