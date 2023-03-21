from scipy.signal import savgol_filter
import numpy as np


def calculate(x, y, input):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  window = input[0]
  threshold = input[1]
  thratio = input[2]

  dy = savgol_filter(y,window, 3, deriv=1)
  for j in range(len(dy)):
    if dy[j] > threshold / 1e12:
      break
  k=j
  for k in range(j, 0, -1):
    if dy[k] < thratio * threshold / 1e14:
      break
  return [x[k], y[k]]

