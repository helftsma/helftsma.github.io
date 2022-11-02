import afmformats as afm

class AFMFormatter:
    def __init__(self):
        self.filePath = "" #path to data files
        self.fileNames = [] #list of filenames
        self.fileDict = {} #dict of fileName : fileStub
        self.AFMGroup = afmformats.AFMGroup()


    def addFilePath(self, path): #sets filePath
        self.filePath = path
        return

    def addFile(self, fileName, fileStub): #adds a file with a reference name
        self.fileNames.append(fileName)
        self.fileDict[fileStub] = fileName
        return

    def addFile(self, fileStub): #adds a file with no reference name
        self.fileNames.append(fileStub)
        self.fileDict[fileStub] = fileStub
        return

    def groupData(self): #adds all files to AFMGroup object
        for file in self.fileNames:
            self.AFMGroup += afm.load_data(self.filePath + file)
        return self.AFMGroup

    def addToGroup(self,fileRef): #adds given file to AFMGroup
        self.AFMGroup += afm.load_data(self.filePath + fileRef)
        return self.AFMGroup

    def getGroup(self): #getter for AFMGroup Object
        return self.AFMGroup

    def getSubgroup(self, fileRef): #returns subgroup of a given fileRef
        if (fileRef in self.fileDict.values or fileRef in self.fileDict.keys):
            return self.AFMGroup.subgroup_with_path(self.filePath + self.fileDict[fileRef])
        return None

    def getColumns(key, dataList):
        if (key<len(dataList)):
            return dataList[key]
        return None

    def getValues(dataList, key, dictKey):
        if (key<len(dataList) and dictKey in dataList[key].keys):
            return dataList[key][dictKey]
        return None