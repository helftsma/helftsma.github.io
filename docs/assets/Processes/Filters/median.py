import numpy as np
from scipy.signal import medfilt


def calculate(x, y, input):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)
  window = input[0]

  win = window * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(win / xstep)
  if win % 2 == 0:
    win += 1
  xfiltered = x
  yfiltered = medfilt(y, win)
  return xfiltered, yfiltered

