#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np

class Filter(): #could be used as superclass


    #Set here the details of the procedure
    def __init__(self):
        self.name  #Name, please keep it short as it will appear in the combo box of the user interface
        self.desc #Free text
        self.doi #set a DOI of a publication you want/suggest to be cited, empty if no reference
        self.dependance = ['para1'] #list of dependant variables that must be set

    def setValues(self, values): #setter for dependant values
        self.values = values 

    def DependancyNotMetError(Exception): #Bespoke error for dependance check fail
        print("The dependancies of this class has not been met, make sure all dependancies have been set before calling them")
        pass

    def getValue(self, key): #getter for dependant values
        try:
            if len(self.values.keys) < len(self.dependance):
                raise self.DependancyNotMetError()
            else:
                return self.values[key]
        except:
            raise self.DependancyNotMetError()
        

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