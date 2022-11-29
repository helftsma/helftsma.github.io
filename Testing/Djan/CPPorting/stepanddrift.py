# import the main panels structure, required
from __skeletonCP__ import CP
# import here your procedure-specific modules, no requirements (numpy as an example)
from scipy.signal import savgol_filter

# Create your filter class by extending the main one
# Additional methods can be created, if required
class Step(CP):
    def __init__(self):
        self.name = "Step"
        self.desc = 'Identify the CP by steps in first derivative'
        self.doi = ''
        self.dependance = ['window', 'threshold', 'thratio']

    def calculate(self, x, y):
        dy = savgol_filter(y, self.getValue('window'), 3, deriv=1)
        for j in range(len(dy)):
            if dy[j] > self.getValue('threshold') / 1e12:
                break
        for k in range(j, 0, -1):
            if dy[k] < self.getValue('thratio') * self.getValue('threshold') / 1e14:
                break
        return [x[k], y[k]]
