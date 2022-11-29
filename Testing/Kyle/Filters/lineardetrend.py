# import the filter super-class
from __skeletonfilter__ import Filter
# import here your procedure-specific modules, no requirements (numpy as an example)

import numpy as np
from scipy.signal import savgol_filter

# Create your filter class by extending the main one
# Additional methods can be created, if required
class LinearDetrendFilter(Filter):
    def __init__(self):
        self.name = "Linear Detrend"
        self.desc = 'Removes linear trend obtained from baseline of F-z curves. Baseline is identified through thresholding (Threshold method of contact point). Ideal for data whose baseline trend hinders correct calculation of the contact point'
        self.doi = ''
        self.dependance = ['window','threshold']

    def calculate(self, x, y):
        x_base, y_base = self.get_baseline(x, y)
        m, q = np.polyfit(x_base, y_base, 1)
        return x, y - m * x - q

    def get_baseline(self, x, y):
        dy = savgol_filter(y, self.getValue('window'), 3, deriv=1)
        for j in range(len(dy)):
            if dy[j] > self.getValue('threshold') / 1e12:
                break
        for k in range(j, 0, -1):
            if dy[k] < 0:
                break
        return [x[:k], y[:k]]
