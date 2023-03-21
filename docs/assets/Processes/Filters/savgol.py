from scipy.signal import savgol_filter
import numpy as np


# window and order are user inputs
def calculate(x, y, input):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  window = input[0]
  order = input[1]

  win = window * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(win / xstep)
  polyorder = order

  if win % 2 == 0:
    win += 1

  if polyorder > win:
    return None, None

  y_smooth = savgol_filter(y, win, polyorder)

  return x, y_smooth
