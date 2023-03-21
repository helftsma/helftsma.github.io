from savgol import calculate
import numpy as np


def test_calculate():
  assert calculate([4, 5, 7, 2, 23, 6, 7, 32], [1, 2, 3, 4, 3, 2, 1, 0, -0.5, -2, 0, 5, 10, 20, 30, 40, -1, -2], [25,3]) == (None, None)
