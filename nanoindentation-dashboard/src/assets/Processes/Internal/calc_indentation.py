import numpy as np

# Z and F are the displacement and force of the curve
# CP is calculated and returned from any CPoint proccess
# I think spring_constant is also a user input


def calculate(Z, F, inputs):
  CP = inputs[0]
  spring_constant=inputs[1] #default: 1
  setzeroforce=inputs[2] #default: True
  Z = [element for element in Z]
  F = [element for element in F]
  Z = np.array(Z)
  F = np.array(F)
  CP = [element for element in CP]

  iContact = np.argmin((Z - CP[0]) ** 2)
  if setzeroforce is True:
    Yf = F[iContact:] - CP[1]
  else:
    Yf = F[iContact:]
  Xf = Z[iContact:] - CP[0]
  Zi = Xf - Yf / spring_constant
  Fi = Yf
  return Zi, Fi
