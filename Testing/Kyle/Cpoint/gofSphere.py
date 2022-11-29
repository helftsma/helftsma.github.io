#import the main panels structure, required
from __skeletonfilter__ import Filter
#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np
from scipy.optimize import curve_fit



# Create your filter class by extending the main one
# Additional methods can be created, if required
class GoFSphere(Filter):
    def __init__(self):
        self.name = "GoF sphere"
        self.desc = 'Computes CP based on the GoF method using the Hertz solution for a spherical indenter'
        self.doi = ''
        self.dependance = ['force threshold','x range','fit window','radius']

    def calculate(self, x, y):
        # Retunrs contact point (z0, f0) based on max R**2
        try:
            zz_x, r_squared = self.getWeight(x, y)
        except TypeError:
            return False
        r_best_ind = np.argmax(r_squared)
        j_gof = np.argmin((x - zz_x[r_best_ind]) ** 2)
        return [x[j_gof], y[j_gof]]

    # Returns min and max indices of f-z data considered
    def getRange(self, x, y):
        try:
            jmax = np.argmin((y - self.getValue('force threshold') * 1e-9) ** 2)
            jmin = np.argmin((x - (x[jmax] - self.getValue('x range') * 1e-9)) ** 2)
        except ValueError:
            return False
        return jmin, jmax

    def getWeight(self, x, y):
        # Retunrs weight array (R**2) and corresponding index array. Uses get_indentation and fit methods defined below
        jmin, jmax = self.getRange(x, y)
        if jmin is False or jmax is False:
            return False
        zwin = self.getValue('fit window') * 1e-9
        zstep = (max(x) - min(x)) / (len(x) - 1)
        win = int(zwin / zstep)

        r_squared = []
        j_x = np.arange(jmin, jmax)
        for j in j_x:
            try:
                ind, Yf = self.get_indentation(x, y, j, win)
                E_std = self.fit(x, y, ind, Yf)
                r_squared.append(E_std)
            except TypeError:
                return False
        return x[jmin:jmax], r_squared

    def get_indentation(self, x, y, iContact, win):
        # Retunrs indentation f and ind from f and z
        z = x
        f = y
        R = self.curve.tip['radius']
        if (iContact + win) > len(z):
            return False
        Zf = z[iContact: iContact + win] - z[iContact]
        Yf = f[iContact: iContact + win] - f[iContact]
        ind = Zf - Yf / self.curve.spring_constant
        ind = ind[ind <= 0.1 * R]
        Yf = Yf[ind <= 0.1 * R]  # fit only for small indentations
        return ind, Yf

    def fit(self, x, y, ind, f):
        seeds = [1000.0 / 1e9]
        try:
            R = self.curve.tip['radius']

            def Hertz(x, E):
                x = np.abs(x)
                poisson = 0.5
                return (4.0 / 3.0) * (E / (1 - poisson ** 2)) * np.sqrt(R * x ** 3)

            popt, pcov = curve_fit(Hertz, ind, f, p0=seeds, maxfev=100000)
            residuals = f - Hertz(ind, *popt)
            ss_res = np.sum(residuals ** 2)
            ss_tot = np.sum((f - np.mean(f)) ** 2)
            R_squared = 1 - (ss_res / ss_tot)
            return R_squared
        except (RuntimeError, ValueError):
            return False
