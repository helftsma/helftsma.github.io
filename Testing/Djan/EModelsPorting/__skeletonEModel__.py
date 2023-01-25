#import here your procedure-specific modules, no requirements (numpy as an example)
import numpy as np

# Create your filter class by extending the main one
# Additional methods can be created, if required
class EModel():
    def __init__(self, name, desc, doi, parameters):
        #Set here the details of the procedure
        self.name = name #Name, please keep it short as it will appear in the combo box of the user interface
        self.desc = desc #Free text
        self.doi = doi #set a DOI of a publication you want/suggest to be cited, empty if no reference
        self.parameters = parameters #dict of parameters in the form [{"key":key, "type":type, "desc":desc, "val":val}]

    def addParameter(self, key, type, desc, val):
        self.parameters.append({"key":key, "type":type, "desc":desc, "val":val})

    def create(self):
        # This function is required and describes the form to be created in the user interface 
        # The last value is the initial value of the field; currently 3 types are supported: int, float and combo
        # Parameters can be used as seeds or proper parameters (e.g. indentation depth ?) 
        self.addParameter('para1','int','Integer parameter [a.u.]',0)
        self.addParameter('para2','float','Float parameter [N]',25)
        self.addParameter('para3','combo',"Select smooth method",'med',
            dataset = {'med':'MedFilt','sg':'Savitzky-Golay'}) #Possible values are passed as dictionary; values are the labels

    def theory(self):
        # Calculate the fitting function for a specific set of parameters
        return

    def calculate(self):
        # This function gets the current x and y and returns the parameters.
        p1 = self.getValue('para1') # get the value of the parameters as set by the user
        if p1 > 10:
            return False # If an error occurs, return False
        pars = [1,1]
        return pars