# import the filter super-class
from __skeletonfilter__ import Filter
# import here your procedure-specific modules, no requirements (numpy as an example)

from scipy.signal import medfilt

# Create your filter class by extending the main one
# Additional methods can be created, if required
class MedianFilter(Filter):
    def __init__(self):
        self.name = "Prominence"
        self.desc = 'Filters prominent peaks in the Fourier space, to eliminate oscillations'
        self.doi = ''
        self.dependance = ['win']

    def calculate(self, x, y, curve=None):
        win = self.getValue('win') * 1e-9
        xstep = (max(x) - min(x)) / (len(x) - 1)
        win = int(win / xstep)
        if win % 2 == 0:
            win += 1
        xfiltered = x
        yfiltered = medfilt(y, win)
        return xfiltered, yfiltered
