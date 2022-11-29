# import the filter super-class
from __skeletonfilter__ import Filter
# import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np
from scipy.signal import find_peaks
from scipy.interpolate import interp1d

# Create your filter class by extending the main one
# Additional methods can be created, if required
class ProminenceFilter(Filter):
    def __init__(self):
        self.name = "Prominence"
        self.desc = 'Filters prominent peaks in the Fourier space, to eliminate oscillations'
        self.doi = ''
        self.dependance = ['pro','band','thresold']

    def calculate(self, x, y):
        # threshold is the minimum frequency to be eventually filtered
        # winperc is the width around the filtered frequency in % of the position
        # pro is the peak prominency
        ff = np.fft.rfft(y, norm=None)
        idex = find_peaks(np.log(np.abs(ff)), prominence=self.getValue('pro'))
        xgood = np.ones(len(ff.real)) > 0.5
        for imax in idex[0]:
            jwin = int(imax * self.getValue('band') / 100)
            if imax > self.getValue('threshold') and jwin == 0:
                xgood[imax] = False
            elif imax > self.getValue('threshold'):
                ext1 = np.max([imax - jwin, 0])
                ext2 = np.min([imax + jwin + 1, len(xgood) - 1])
                for ii in range(ext1, ext2):
                    xgood[ii] = False
        if np.sum(xgood) < 50:
            return
        xf = np.arange(0, len(ff.real))
        yinterpreal = interp1d(xf[xgood], ff.real[xgood], kind='linear')
        yinterpimag = interp1d(xf[xgood], ff.imag[xgood], kind='linear')
        ff.real = yinterpreal(xf)
        ff.imag = yinterpimag(xf)
        return x, np.fft.irfft(ff, n=len(y))
