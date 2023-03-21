import numpy as np
from scipy.signal import find_peaks
from scipy.interpolate import interp1d


def calculate(x, y, input):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  band = input[0]
  pro = input[1]
  threshold = input[2]

  ff = np.fft.rfft(y, norm=None)
  idex = find_peaks(np.log(np.abs(ff)), prominence=pro)
  xgood = np.ones(len(ff.real)) > 0.5

  for imax in idex[0]:
    jwin = int(imax * band / 100)
    if imax > threshold and jwin == 0:
      xgood[imax] = False
    elif imax > threshold:
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
