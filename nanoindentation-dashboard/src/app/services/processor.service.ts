import {Injectable} from '@angular/core';
import {EProcType, Process} from "../models/process.model";
import {loadPyodide} from "pyodide";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GraphService} from "./graph.service";
import {ErrorHandlerService} from "./error-handler.service";
import {Datapoint} from "../models/datapoint.model";
import {Dataset} from "../models/dataset.model";
import {CustomError} from '../models/error.model';
import {EInputFieldType} from '../models/input.model';
import {WrittenProcesses} from "../../environments/environment";

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  // decides whether re-calculate section n sidenav is shown
  showReCalculateButton: boolean = false;


  // keeps track whether any processes are running
  // displays loading animation if so
  // true if processes are running
  // false if no processes are running
  private _loading: BehaviorSubject<string[]>;

  public get loading$(): Observable<string[]> {
    return this._loading.asObservable();
  }

  public set loading(strings: string[]) {
    this._loading.next(strings);
  }

  public get loading(): string[] {
    return this._loading.value;
  }

  //Container for selected Filters
  private _selectedFilters: Process[] = [];

  //getter for selected filters
  public get selectedFilters(): Process[] {
    return this._selectedFilters;
  }

  //setter for selected filters (also runs all filters)
  public set selectedFilters(filters: Process[]) {
    this._selectedFilters = filters;

    this.loading = ['Resetting filters'];
    // RESET FILTERED DATA
    this.graphService.selectedDatafile.datasets.forEach((dataset: Dataset, index: number) => {
      this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = this.graphService.selectedDatafile.datasets[index].displacementForceData;
    })
    this.graphService.selectedDatafile = this.graphService.selectedDatafile;
    this.loading = ['Filters reset ✔']

    // whenever selected filters change: run runFilters() from the start (index 0)
    this.runFrom(EProcType.FILTER);
  }

  //container for selected Cpoint processes
  private _selectedCPointProcess: Process = null;

  //Setter for selected Cpoint process (also runs Cpoint process)
  public set selectedCPointProcess(process: Process) {
    this._selectedCPointProcess = process;
    this.runFrom(EProcType.CPOINT);//when CPoint process is changed, calculate Cpoint
  }

  //Getter for selected Cpoint process
  public get selectedCPointProcess(): Process {
    return this._selectedCPointProcess;
  }

  //container for selected Emodel processes
  private _selectedEmodels: Process[] = [];

  //Setter for selected Emodel process (also runs Emodel process)
  public set selectedEmodels(processes: Process[]) {
    this._selectedEmodels = processes;
    this.runFrom(EProcType.EMODELS);//when Emodel process is changed, calculate Emodel
  }

  //Getter for selected Emodels process
  public get selectedEmodels(): Process[] {
    return this._selectedEmodels;
  }

  //container for selected Fmodels processes
  private _selectedFmodels: Process[] = [];

  //Setter for selected Fmodels process (also runs Fmodels process)
  public set selectedFmodels(processes: Process[]) {
    this._selectedFmodels = processes;
    this.runFrom(EProcType.FMODELS);//when Fmodels process is changed, calculate Fmodels
  }

  //Getter for selected Fmodels process
  public get selectedFmodels(): Process[] {
    return this._selectedFmodels;
  }

  //container for selected Test processes
  private _selectedTests: Process[] = null;

  //Setter for selected test process (also runs test processes)114:
  public set selectedTests(processes: Process[]) {
    this._selectedTests = processes;
    //this.runFrom(EProcType.TEST); //when Test processes are changed, calculate all from Tests
  }

  //Getter for selected Fmodels process
  public get selectedTests(): Process[] {
    return this._selectedTests;
  }

  private rootPath: string = 'assets/Processes/'; //path of process scripts

  //container for all available processes (Default set as the processes stored in the environment)
  public availableProcesses: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[], internal: Process[], test: Process[] } = WrittenProcesses;

  public addProcess(process: Process) { //adds a process definition to the data struct
    try {
      switch (process.procType) { //add to the correct container acording to process type
        case EProcType.CPOINT: {
          console.log("CPoint");
          this.availableProcesses.cPoints.push(process);
          break;
        }
        case EProcType.FILTER: {
          console.log("Filter");
          this.availableProcesses.filters.push(process);
          break;
        }
        case EProcType.EMODELS: {
          console.log("EModel");
          this.availableProcesses.eModels.push(process);
          break;
        }
        case EProcType.FMODELS: {
          console.log("FModel");
          this.availableProcesses.fModels.push(process);
          break;
        }
        case EProcType.TEST: {
          this.availableProcesses.test.push(process);
          break;
        }
        default: {
          console.log("Could not find type");
          // this.graphService.showErrorDialog("Could not find Process Type");
          throw new Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      return this.availableProcesses;
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //catch any errors
    }
  };

  private _testOutDatasets: Dataset[]; //container for output of testing datasets

  //getter for processed dataset
  public get testOutDatasets(): Dataset[] {
    return this._testOutDatasets;
  }

  //constructor for object
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private graphService: GraphService) {
    this._loading = new BehaviorSubject<string[]>(['Initializing pyodide...']);
    this.initPy();
  }

  async initPy() { //initialise Pyodide
    try {
      loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
        globalThis.pyodide = pyodide;
        this.loading = ['pyodide initialized ✔', 'Initializing numpy...'];
        globalThis.pyodide.loadPackage(['numpy']).then(() => {
          this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'Initializing scipy...'];
          globalThis.pyodide.loadPackage(['scipy']).then(() => {
            this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'scipy initialized ✔'];
            this.loading = [];
          })
        })
      })
    } catch (e: any) {
      this.errorHandlerService.Fatal(e); // catch error
    }
  }

  //Uses the given process name and processes path to give the script
  // returns script or promise of script if successful, -1 if error occurred
  public getScript(process: Process): Promise<string> | CustomError {
    try {
      if (process.script) { //if process has a script recorded
        //get process from data sytem
        return new Promise((resolve) => {
          resolve(process.script); //return script as promise stored in process
        });
      }
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //fatal error if data system could be reached
    }

    let procPath = this.rootPath; //path to filesystem
    try {
      // If the process is not recorded, look for it:
      switch (process.procType) {
        case EProcType.CPOINT: {
          procPath += 'CPoints/'; //add relevant folder to path
          break;
        }
        case EProcType.FILTER: {
          procPath += 'Filters/';
          break;
        }
        case EProcType.EMODELS: {
          procPath += 'EModels/';
          break;
        }
        case EProcType.FMODELS: {
          procPath += 'FModels/';
          break;
        }
        case EProcType.INTERNAL: {
          procPath += 'Internal/';
          break;
        }
        case EProcType.TEST: {
          procPath += 'Tests/';
          break;
        }
        default: {
          throw new Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      procPath += process.id + '.py'; //add file name to path to get path to file
      return this.http.get(procPath, {responseType: 'text'}).toPromise(); //return as promise

    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //return error if caught
    }
  }

  private runProcessScriptOnDatapoints(datapoints: Datapoint[], processScript: string, arg?: any): Datapoint[] | Datapoint {
    let convertedDataset: { x: number[], y: number[] } = this.convertDatapointsArrayToXAndYArray(datapoints);
    let xAxis = convertedDataset.x;
    let yAxis = convertedDataset.y;
    let result;

    try {
      globalThis.pyodide.runPython(processScript); //Running the code
      let calculate = globalThis.pyodide.globals.get('calculate'); //map the function from the global variables onto 'calculate'

      let resultPy: any;


      if (arg) {
        resultPy = calculate(xAxis, yAxis, arg); //run function on the dataset
      } else {
        resultPy = calculate(xAxis, yAxis); //run function on the dataset
      }
      result = resultPy.toJs(); //translate result to JS
      result = {x: result[0], y: result[1]}; //map result onto container

      // If script returns [None, None], an error has been caught in the python code
      if (result.x == null || result.y == null) {
        throw new Error('CodeError: ERROR IN PYTHON SCRIPT');
      }

      if (result.x.length > 1 && result.y.length > 1) {
        result = this.convertXAndYArrayToDatapointsArray(result);
      } else {
        result = result as Datapoint
      }
      resultPy.destroy();//free the function used
    } catch (e: any) {
      result = this.errorHandlerService.Fatal(e); //record any error
    } finally {
      return result; //might return Error
    }
  }

  public convertDatapointsArrayToXAndYArray(datapoints: Datapoint[]): { x: number[], y: number[] } {
    let x: number[] = [];
    let y: number[] = [];

    datapoints.forEach((datapoint: Datapoint) => {
      x.push(datapoint.x);
      y.push(datapoint.y);
    })

    return {x: x, y: y};
  }

  public convertXAndYArrayToDatapointsArray(input: { x: number[], y: number[] }): Datapoint[] | CustomError {
    let datapoints: Datapoint[] = [];

    if (input.x.length == input.y.length) {

      input.x.forEach((x: number, index: number) => {
        datapoints.push({x: input.x[index], y: input.y[index]})
      })
      return datapoints;
    }

    return this.errorHandlerService.Fatal(Error('DataInputError: X AND Y AXIS ARE NOT OF EQUAL LENGTH'));
  }

  //given a list of processes, recursively runs them and stores the output in graphs
  private runAll(processes: Process[], datasets: Dataset[] = this.graphService.selectedDatafile.datasets): void | CustomError {
    if (processes.length == 0) { // base case
      // FINISHED
      this.loading = [];
      return;
    }

    let currentProcess = processes.shift(); // removes element from index 0 -> shifts everything to the left -> stores it in currentProcess

    let loadingMsgs: string[] = this.loading;//add loading message
    loadingMsgs.push('Running ' + currentProcess.name + '...');
    this.loading = loadingMsgs;

    let getScriptPromise: Promise<string> | CustomError = this.getScript(currentProcess); //get script of process

    if (!(getScriptPromise instanceof Promise<string>)) {//if a promise is not returned
      getScriptPromise.message = 'ERROR: Script could not be obtained'; //set error message
      return getScriptPromise; //do smth to show that it's an error
    }

    let recurReturn = null;
    getScriptPromise.then((processScript) => {

      currentProcess.script = processScript; //cache script in Process object
      for (let index = 0; index < datasets.length; index += 1) { // run script on each dataset
        let dataset: Dataset = datasets[index]; //set the current dataSet
        let inputDatapoints: Datapoint[] = [];

        //select datapoints to be processed depending on type of process
        switch (currentProcess.procType) {
          case EProcType.FILTER:
            inputDatapoints = dataset.displacementForceFilteredData;
            break;
          case EProcType.CPOINT:
            inputDatapoints = dataset.displacementForceFilteredData;
            break;
          case EProcType.INTERNAL:
            if (currentProcess.id == 'calc_indentation') {
              inputDatapoints = dataset.displacementForceFilteredData;
              currentProcess.inputs[0].selectedValue = dataset.contactPoint; //set CP in dataset to be the value
            } else if (currentProcess.id == 'calc_elspectra') {
              inputDatapoints = dataset.displacementForceFilteredData;
            }
            break;
          case EProcType.EMODELS:
            inputDatapoints = dataset.indentationForceData;
            break;
          case EProcType.FMODELS:
            inputDatapoints = dataset.indentationForceData;
            break;
          case EProcType.TEST:
            inputDatapoints = dataset.testData;
            break;
        }

        let inputArgs: any = currentProcess?.inputs?.map(input => {
          if (input.type == EInputFieldType.DATAPOINT) {
            return [input.selectedValue.x, input.selectedValue.y] //convert Datapoint type to x and y array
          }
          return input.selectedValue
        }); //map selected values onto inputarg


        //INPUT CHECKING
        if (currentProcess?.inputs?.length) { //if there are user inputs required check for null
          for (let input of inputArgs) {
            if (!input == undefined) { //if an input is set to be null and there are user inputs specified
              return this.errorHandlerService.Fatal(new Error("InputError: input not given"));
            }
          }
        }


        //run process on input datapoints
        let outputDatapoints: any;
        if (inputArgs?.length) {
          outputDatapoints = this.runProcessScriptOnDatapoints(inputDatapoints, processScript, inputArgs);
        } else {
          outputDatapoints = this.runProcessScriptOnDatapoints(inputDatapoints, processScript);
        }

        // skip if type is error
        if (typeof (outputDatapoints) == 'object' && outputDatapoints.error) {
          this.graphService.selectedDatafile = this.graphService.selectedDatafile;
          loadingMsgs[loadingMsgs.length - 1] = currentProcess.name + ' skipped due to error ~'
          recurReturn = this.runAll(processes); // recursive call
          return recurReturn
        }

        //set dataset being displayed according to the type of process that was run
        switch (currentProcess.procType) {
          case EProcType.FILTER:
            this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = outputDatapoints as Datapoint[];
            break;
          case EProcType.CPOINT:
            this.graphService.selectedDatafile.datasets[index].contactPoint = outputDatapoints as Datapoint;
            break;
          case EProcType.INTERNAL:
            if (currentProcess.id == 'calc_indentation') {
              this.graphService.selectedDatafile.datasets[index].indentationForceData = outputDatapoints as Datapoint[];
            } else if (currentProcess.id == 'calc_elspectra') {
              this.graphService.selectedDatafile.datasets[index].elspectraData = outputDatapoints as Datapoint[];
            }
            break;
          case EProcType.EMODELS:
            // TODO: IMPLEMENT
            break;
          case EProcType.FMODELS:
            // TODO: IMPLEMENT
            break;
          case EProcType.TEST:
            this._testOutDatasets[index].testData = outputDatapoints as Datapoint[] //stores output in processor
            break;
        }
      }

      //change loading msg
      this.graphService.selectedDatafile = this.graphService.selectedDatafile;
      loadingMsgs[loadingMsgs.length - 1] = currentProcess.name + ' done ✔'
      recurReturn = this.runAll(processes); // recursive call
      return recurReturn
    })
    this.showReCalculateButton = false;
    return recurReturn; //if null it was successful
  }

  //Runs all the processes from (and including) the process type specified
  public runFrom(procType: EProcType, datasets?: Dataset[]): void | CustomError {
    this.loading = ['Creating Process Chain'];

    try {
      let processChain: Process[] = [];
      switch (procType) { //append relevant containers to processChain according to which type is selected
        //@ts-expect-error
        case EProcType.FILTER: {
          processChain = processChain.concat(this.selectedFilters); //append to chain
        } //fallthrough to the next procType
        //@ts-expect-error
        case EProcType.CPOINT: {
          if (!this.selectedCPointProcess) {//if there are no selected process of the type
            break;  //skip
          }
          processChain.push(this.selectedCPointProcess);
        }
        //@ts-expect-error
        case EProcType.INTERNAL: {
          if (!this.availableProcesses.internal.length) {
            break;
          }
          processChain = processChain.concat(this.availableProcesses.internal);
        }
        //@ts-expect-error
        case EProcType.EMODELS: {
          if (!this.selectedEmodels?.length) {
            break;
          }
          processChain = processChain.concat(this.selectedEmodels);
        }
        //@ts-expect-error
        case EProcType.FMODELS: {
          if (!this.selectedFmodels.length) {
            break;
          }
          processChain = processChain.concat(this.selectedFmodels);
        }
        case EProcType.TEST: {
          if (!this.selectedTests?.length) {
            break;
          }
          processChain = processChain.concat(this.selectedTests);
          break;
        }
        default: {
          throw new Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      if (datasets?.length) {
        return this.runAll(processChain, datasets); //if custom datasets have been given, run on those datasets
      }
      return this.runAll(processChain); //runs the whole chain, returns null if successful, customError if not
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //catch any errors as fatal errors
    }
  }

  updateSettings(settings: any) {
    if (settings.availableProcesses) {
      this.availableProcesses = settings.availableProcesses;
    }
    if (settings.selectedFilters) {
      let filters: Process[] = [];
      settings.selectedFilters.forEach(filter => {
        filters.push(this.availableProcesses.filters.find(p => p.id == filter.id))
      })
      this.selectedFilters = filters;
    }
    if (settings.selectedCPointProcess) {
      this.selectedCPointProcess = this.availableProcesses.cPoints.find(p => p.id == settings.selectedCPointProcess.id);
    }
  }
}
