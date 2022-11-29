#import the main panels structure, required
from __skeletonCP__ import CP
#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np
from scipy.signal import savgol_filter


# Create your filter class by extending the main one
# Additional methods can be created, if required
class PrimeFunctionDerivative(CP):
    def __init__(self):
        self.name = "Prime function derivative"
        self.desc = ''
        self.doi = ''
        self.dependance = ['window','order']

    def calculate(self, x, y):
        z = x
        f = y
        rz = np.linspace(min(z), max(z), len(z))
        f = np.interp(rz, z, f)
        space = rz[1] - rz[0]
        win = self.getValue('window')*1e-9
        order = self.getValue('order')
        iwin = int(win/space)
        if iwin % 2 == 0:
            iwin += 1
        if order > iwin:
            return False
        iwin_big = iwin*5
        z, ddS = self.getWeight(x,y)
        f = f[iwin_big:-iwin_big]
        best_ind = np.argmax(ddS**2)
        jcp = np.argmin((z - z[best_ind])**2)
        return [z[jcp], f[jcp]]

    def getWeight(self, x, y):
        z = x
        f = y
        rz = np.linspace(min(z), max(z), len(z))
        rF = np.interp(rz, z, f)
        space = rz[1] - rz[0]
        win = self.getValue('window')*1e-9
        order = self.getValue('order')
        iwin = int(win/space)
        if iwin % 2 == 0:
            iwin += 1
        if order > iwin:
            return False
        S = savgol_filter(rF, iwin, order, deriv=1, delta=space)
        S = S / (1-S)
        # clean first derivative
        S_clean = savgol_filter(S, iwin*50+1, polyorder=4)  # window length?
        # second derivtive
        ddS = savgol_filter(S_clean, iwin,
                            polyorder=4, deriv=1, delta=space)
        iwin_big = iwin*10  # avoids extrem spikes (arbitrary)
        return rz[iwin_big:-iwin_big], ddS[iwin_big:-iwin_big]
