import numpy as np
from median import calculate


def test_calculate():
  x, y = calculate([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [25])
  assert x.tolist() == [1, 2, 3, 4, 5]
  assert y.tolist() == [1., 2., 3., 4., 5., 6., 7., 8., 9., 10.]
