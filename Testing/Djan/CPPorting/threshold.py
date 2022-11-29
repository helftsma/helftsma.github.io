# import the main panels structure, required
from __skeletonCP__ import CP
# import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np

# Create your filter class by extending the main one
# Additional methods can be created, if required
class Threshold(CP):
    def __init__(self):
        self.name = "Threshold"
        self.desc = 'Identify the CP by thresholding it'
        self.doi = ''
        self.dependance = ['Athreshold', 'deltaX', 'Fthreshold','shift']

    def calculate(self, x, y):
        yth = self.getValue('Athreshold') * 1e-9
        if yth > np.max(y) or yth < np.min(y):
            return False
        jrov = 0
        for j in range(len(y) - 1, 1, -1):
            if y[j] > yth and y[j - 1] < yth:
                jrov = j
                break
        if jrov == 0 or jrov == len(y) - 1:
            return False
        x0 = x[jrov]
        dx = self.getValue('deltaX') * 1e-9
        ddx = self.getValue('Fthreshold') * 1e-9
        if ddx <= 0:
            jxalign = np.argmin((x - (x0 - dx)) ** 2)
            f0 = y[jxalign]
        else:
            jxalignLeft = np.argmin((x - (x0 - dx - ddx)) ** 2)
            jxalignRight = np.argmin((x - (x0 - dx + ddx)) ** 2)
            f0 = np.average(y[jxalignLeft:jxalignRight])
        jcp = jrov
        for j in range(jrov, 1, -1):
            if y[j] > f0 and y[j - 1] < f0:
                jcp = j
                break
        if jcp == 0:
            return False
        sh = self.getValue('shift') * 1e-9
        xcp = x[jcp] + sh
        ycp = y[np.argmin((x - xcp) ** 2)]
        return [xcp, ycp]