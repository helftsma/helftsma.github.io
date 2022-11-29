# import the filter super-class
from __skeletonfilter__ import Filter
# import here your procedure-specific modules, no requirements (numpy as an example)
from scipy.signal import savgol_filter

# Create your filter class by extending the main one
# Additional methods can be created, if required
class SavGolFilter(Filter):
    def __init__(self):
        self.name = "SavGol"
        self.desc = 'Filter the curve with a Savitzky Golay filter; ideal to preserve steps' 
        self.doi = 'https://doi.org/10.1038/s41592-019-0686-2'
        self.dependance = ['win','order']

    def calculate(self, x, y):
        win = self.getValue('win')*1e-9
        xstep = (max(x) - min(x)) / (len(x) - 1)
        win = int(win / xstep)
        polyorder = self.getValue('order')
        if win % 2 == 0:
            win += 1
        if polyorder > win:
            return False
        y_smooth = savgol_filter(y, win, polyorder)
        return x, y_smooth