const Processor = {
    processes: {"Filter":[],"CPoint":[],"EModels":[],"FModels":[]}, //Registered process names dict
    processChain: [], //Processes being applied
    dataSet: {}, //Original datasets dict
    currData: {}, //Current dataset dict
    FindProcess: function(procName){ //
        //smth smth find the process script
        //smth smth return script
    },
    AddProcess: function(procName,procType){
        var procScript = this.FindProcess(procName,procType)
        var newData = Translator.DoProcess(procScript,this.currData)//PYODIDE STUFF IG
        this.currData = newData
        return newData
    }
}
