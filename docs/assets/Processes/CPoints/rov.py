import numpy as np

def calculate(x, y):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  zz_x, rov = getWeight(x, y)
  rov_best_ind = np.argmax(rov)
  j_rov = np.argmin((x - zz_x[rov_best_ind]) ** 2)
  return [x[j_rov], y[j_rov]]


def getRange(x, y, Fthreshold = 10, Xrange = 1000):
  try:
    jmax = np.argmin((y - Fthreshold * 1e-9) ** 2)
    jmin = np.argmin((x - (x[jmax] - Xrange * 1e-9)) ** 2)
  except ValueError:
    return False
  return jmin, jmax


def getWeight(x, y, windowr = 200):
  jmin, jmax = getRange(x, y)
  winr = windowr * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(winr / xstep)
  if (len(y) - jmax) < int(win):
    return False
  if (jmin) < int(win):
    return False
  rov = []

  if jmin == jmax:
    jmax = jmax + 1

  for j in range(jmin, jmax):
    rov.append((np.var(y[j + 1: j + win])) / (np.var(y[j - win: j - 1])))
  return x[jmin:jmax], rov
