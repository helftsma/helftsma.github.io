#import the main panels structure, required
from __skeletonfilter__ import Filter
#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np
from scipy.signal import savgol_filter


# Create your filter class by extending the main one
# Additional methods can be created, if required
class SecondDerivative(Filter):
    def __init__(self):
        self.name = "Second derivative"
        self.desc = ''
        self.doi = ''
        self.dependance = ['f threshold','x range','window']

    def calculate(self, x, y):
        zz_x, ddf = self.getWeight(x, y)
        ddf_best_ind = np.argmin(ddf)
        jdd = np.argmin((x - zz_x[ddf_best_ind]) ** 2)
        return [x[jdd], y[jdd]]

    def getRange(self, x, y):
        try:
            jmax = np.argmin((y - self.getValue('f threshold') * 1e-9) ** 2)
            jmin = np.argmin((x - (x[jmax] - self.getValue('x range') * 1e-9)) ** 2)
        except ValueError:
            return False
        return jmin, jmax

    def getWeight(self, x, y):
        jmin, jmax = self.getRange(x, y)
        if jmin is False:
            return False
        win = self.getValue('window') * 1e-9
        xstep = (max(x) - min(x)) / (len(x) - 1)
        win = int(win / xstep)
        if win % 2 == 0:
            win += 1
        fsecond = savgol_filter(y, polyorder=4, deriv=2, window_length=win)
        return x[jmin:jmax], fsecond[jmin:jmax]
