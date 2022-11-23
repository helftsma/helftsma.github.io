#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np

class Filter(): #could be used as superclass


    #Set here the details of the procedure
    def __init__(self):
        self.name  #Name, please keep it short as it will appear in the combo box of the user interface
        self.desc #Free text
        self.doi #set a DOI of a publication you want/suggest to be cited, empty if no reference

    def setValues(self, values): #setter for window values
        self.values = values 

    def getValue(self, key):
        return self.values[key]

    def calculate(self, x,y):
        # This function gets the current x and y and returns the filtered version.
        p1 = self.getValue('para1') # get the value of the parameters as set by the user
        if p1 > 10:
            return False # If an error occurs, return False
        xfiltered = x
        yfiltered = y
        return xfiltered,yfiltered

    
# Create your filter class by extending the main one
# Additional methods can be created statically, if required