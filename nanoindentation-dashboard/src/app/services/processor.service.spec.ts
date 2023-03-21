import { EInputFieldType, Input } from '../models/input.model';
import {TestBed, async} from '@angular/core/testing';
import { EProcType } from 'src/app/models/process.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {WrittenProcesses} from "../../environments/environment";
import { Dataset } from '../models/dataset.model';
import { CustomError } from '../models/error.model';
import { Datapoint } from '../models/datapoint.model';

// Custom process to be used for testing
let testProcess = {id:"testProcess", name: "Test", procType: EProcType.TEST, script:"def calculate( x, y): \n return x, y+1"}
// Custom python script to be used for testing, part of testProcess
let testScript = "def calculate( x, y): \n return x, y+1"

//Custom data set to be used for testing
let testData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [1, 2, 3, 4] };

let modelProcessDataSet = WrittenProcesses; // Dataset of recognised Processes taken from environment
modelProcessDataSet.test.push(testProcess); //Push testProcess in it, to create custom WrittenProcesses for testing


  describe('ProcessorService', () => {

    // Initialise all services & components needed for declaring ProcessorService
    let errorHandler = new ErrorHandlerService();
    let http: HttpClient;
    const graph = new GraphService(http);

    let process: ProcessorService;

    beforeEach(async() => {
      //configure all imports and providers needed for testing

       TestBed.configureTestingModule({
        imports:[
          HttpClientTestingModule,

        ],
        providers: [
          GraphService,
          ErrorHandlerService,
          ProcessorService,
        ],
       });
    });


    // Tests if addProcess is ... adding a new python script (Process) to the data structure.
    it('Tests if addProcess ... returns dataset with a new Process added', () => {
      const service: ProcessorService = TestBed.get(ProcessorService); //declare mock ProcessorService
      expect(service.addProcess(testProcess)).toEqual(modelProcessDataSet);
    });

    // Tests if getScript ... is returning the correct script when given a Process name and type.
    it('Tests if getScript ... is returning the correct script when given a Process name and type.', (done)=> { //since there is a promise tested, this is not async.

      const service: ProcessorService = TestBed.get(ProcessorService); //declare mock ProcessorService
      let promise = service.getScript(testProcess);

      if (promise instanceof Promise<String>){ //ensure promise is an instance of the desired data type
        promise.then((result) =>{
          expect(result).toEqual(testScript);
          done(); //testing is done here
        })
      }
     });

     //Test if ... Pyodide, NumPy and SciPy have been loaded
     it('Test if ... Pyodide, NumPy and SciPy have been loaded', () => {
      const spy = spyOn(ProcessorService.prototype, 'initPy').and.stub(); //spy on initPy() inside constructor
      const service = new ProcessorService(http, errorHandler, graph); //create actual instance to call the constructor

      expect(spy).toHaveBeenCalledTimes(1);
     });

     // Test if script executes
     it('Test if ... correct script is selected to run', () => {
      let service = new ProcessorService(http, errorHandler, graph); //create instance because the constructor needs to run

      service.addProcess(testProcess); //add process to the recognised processes
      service.selectedTests = [testProcess]; //select process

      expect(service.selectedTests).toEqual([testProcess]);
     });


     it('Tests if runFrom ... results in runAll method used', ()=>{
      let testDataSet: Dataset = {
        contactPoint: null,
        displacementForceData : [],
        displacementForceFilteredData: [],
        indentationForceData: [],
        elspectraData : [],
        testData: [],
      };

      const spy = spyOn<any>(ProcessorService.prototype, 'runAll').and.stub(); //spy on runAll() function
      let service = new ProcessorService(http, errorHandler, graph); //create instance because the constructor needs to run

      let testDataConverted: any = service.convertXAndYArrayToDatapointsArray(testData);
      if (typeof (testDataConverted) == 'object' && testDataConverted.error)
      {
        fail('Data conversion failed.');                            //create needed Datasets to run the public method runFrom()
      }

      testDataSet.testData = testDataConverted;
      service.addProcess(testProcess);
      service.runFrom(EProcType.TEST, testDataConverted); //call runFrom() method with configured Datasets

      expect(spy).toHaveBeenCalledTimes(1); //expect runAll to have run once
     });


     it('Tests if ... data is successfully converted from X,Y to Datapoint[]', ()=>{

      const service: ProcessorService = TestBed.get(ProcessorService);

      let data1: Datapoint = {x:100, y:1};
      let data2: Datapoint = {x:200, y:2};
      let data3: Datapoint = {x:300, y:3};
      let data4: Datapoint = {x:400, y:4};
      let dataArray = [data1, data2, data3, data4] //create desired form of Datapoint[] model

      expect(service.convertXAndYArrayToDatapointsArray(testData)).toEqual(dataArray);
     });

     it('Tests if ... data is successfully converted from Datapoint[] to X,Y', ()=>{

      const service: ProcessorService = TestBed.get(ProcessorService);

      let data1: Datapoint = {x:100, y:1};
      let data2: Datapoint = {x:200, y:2};
      let data3: Datapoint = {x:300, y:3};
      let data4: Datapoint = {x:400, y:4};
      let dataArray = [data1, data2, data3, data4] //create desired form of Datapoint[] model

      expect(service.convertDatapointsArrayToXAndYArray(dataArray)).toEqual(testData);
     });

});
