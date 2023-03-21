from scipy.optimize import curve_fit
import numpy as np


def calculate(x, y):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  return x[0],y[0]

  ################## BROKEN CUSTOMER CODE

  # Returns contact point (z0, f0) based on max R**2
  #try:
  #  zz_x, r_squared = getWeight(x, y)
  #except TypeError:
  #  return None, None

  #r_best_ind = np.argmax(r_squared)
  #j_gof = np.argmin((x - zz_x[r_best_ind]) ** 2)


  #return [x[j_gof], y[j_gof]]


# Returns min and max indices of f-z data considered
#def getRange(x, y, xRagne = 1000.0, forceThreshold = 10.0):
#  try:
#    jmax = np.argmin((y - forceThreshold * 1e-9) ** 2)
#    jmin = np.argmin((x - (x[jmax] - xRagne * 1e-9)) ** 2)
#  except ValueError:
#    return False
#  return jmin, jmax


#def getWeight(x, y, fitWindow = 200.0):
#  # Retunrs weight array (R**2) and corresponding index array. Uses get_indentation and fit methods defined below
#  jmin, jmax = getRange(x, y)
#  if jmin is False or jmax is False:
#    return False
#  zwin = fitWindow * 1e-9
#  zstep = (max(x) - min(x)) / (len(x) - 1)
#  win = int(zwin / zstep)

#  r_squared = []
#  j_x = np.arange(jmin, jmax)
#  for j in j_x:
#    try:
#      ind, Yf = get_indentation(x, y, j, win)
#      E_std = fit(x, y, ind, Yf)
#      r_squared.append(E_std)
#    except TypeError:
#      return False
#  print(r_squared)
#  return x[jmin:jmax], r_squared
#
#
#def get_indentation(x, y, iContact, win, tipRadius = 1):
#  # Retunrs indentation f and ind from f and z
#  z = x
#  f = y
#  R = tipRadius
#  if (iContact + win) > len(z):
#    return False
#  Zf = z[iContact: iContact + win] - z[iContact]
#  Yf = f[iContact: iContact + win] - f[iContact]
#  ind = Zf - Yf / curve.spring_constant
#  ind = ind[ind <= 0.1 * R]
#  Yf = Yf[ind <= 0.1 * R]  # fit only for small indentations
#  return ind, Yf


def fit(ind, f, tipRadius = 1):
  seeds = [1000.0 / 1e9]
  try:
    R = tipRadius

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
