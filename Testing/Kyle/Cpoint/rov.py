# import the main panels structure, required
from __skeletonfilter__ import Filter
# import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np


# Create your filter class by extending the main one
# Additional methods can be created, if required
class RoV(Filter):
    def __init__(self):
        self.name = "RoV"
        self.desc = 'Identify the CP by ratio of variances'
        self.doi = ''
        self.dependance = ['Fthreshold', 'Xrange', 'windowr']

    def calculate(self, x, y):
        zz_x, rov = self.getWeight(x, y)
        rov_best_ind = np.argmax(rov)
        j_rov = np.argmin((x - zz_x[rov_best_ind]) ** 2)
        return [x[j_rov], y[j_rov]]

    def getRange(self, x, y):
        try:
            jmax = np.argmin((y - self.getValue('Fthreshold') * 1e-9) ** 2)
            jmin = np.argmin((x - (x[jmax] - self.getValue('Xrange') * 1e-9)) ** 2)
        except ValueError:
            return False
        return jmin, jmax

    def getWeight(self, x, y):
        jmin, jmax = self.getRange(x, y)
        winr = self.getValue('windowr') * 1e-9
        xstep = (max(x) - min(x)) / (len(x) - 1)
        win = int(winr / xstep)
        if (len(y) - jmax) < int(win):
            return False
        if (jmin) < int(win):
            return False
        rov = []
        for j in range(jmin, jmax):
            rov.append((np.var(y[j + 1: j + win])) / (np.var(y[j - win: j - 1])))
        return x[jmin:jmax], rov
