import {EInputFieldType} from "src/app/models/input.model";
import {EProcType, Process} from "src/app/models/process.model";

export const environment = {
  production: true,
  apiURL: 'http://nanoindent.pythonanywhere.com'
};

export const WrittenProcesses: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[], internal: Process[], test: Process[] } = {
  filters: [ //Container for available filters
    {
      id: 'linearDetrend',
      name: 'Linear Detrend',
      procType: EProcType.FILTER,
      custom: false
    },
    {
      id: 'median',
      name: 'Median',
      procType: EProcType.FILTER,
      custom: false,
      inputs: [{name: 'Window', type: EInputFieldType.NUMBER, selectedValue: 25}]
    },
    {
      id: 'prominence',
      name: 'Prominence',
      procType: EProcType.FILTER,
      custom: false,
      inputs: [
        {name: 'Band [% preak pos]', type: EInputFieldType.NUMBER, selectedValue: 30},
        {name: 'Pro', type: EInputFieldType.NUMBER, selectedValue: 40},
        {name: 'Threshold', type: EInputFieldType.NUMBER, selectedValue: 25}
      ]
    },
    {
      id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER, custom: false, inputs: [
        {name: 'Window', type: EInputFieldType.NUMBER, selectedValue: 25},
        {name: 'Order', type: EInputFieldType.NUMBER, selectedValue: 3}
      ]
    }
  ],
  cPoints: [//container for cPoints
    {
      id: 'autothresh', name: 'Auto-Threshold', procType: EProcType.CPOINT, custom: false, inputs: [
        {name: 'Zero Range', type: EInputFieldType.NUMBER, selectedValue: 500}
      ]
    },
    {id: 'gofSphere', name: 'GofSphere', procType: EProcType.CPOINT, custom: false, inputs: null},
    {id: 'rov', name: 'Rov', procType: EProcType.CPOINT, custom: false, inputs: null},
    {
      id: 'stepAndDrift', name: 'Step and Drift', procType: EProcType.CPOINT, custom: false, inputs: [
        {name: 'Window', type: EInputFieldType.NUMBER, selectedValue: 101},
        {name: 'Threshold', type: EInputFieldType.NUMBER, selectedValue: 10},
        {name: 'ThRatio', type: EInputFieldType.NUMBER, selectedValue: 25}
      ]
    }
  ],
  eModels: [],//container for eModel
  fModels: [],//container for fModel,
  internal: [
    {
      id: 'calc_indentation', name: 'Calculating Indentation', procType: EProcType.INTERNAL, custom: false,
      inputs:
        [ //container for required user inputs
          {name: "CP", selectedValue: null, type: EInputFieldType.DATAPOINT},
          {name: "spring_constant", selectedValue: 1, type: EInputFieldType.NUMBER},
          {name: "setzeroforce", selectedValue: true, type: EInputFieldType.BOOLEAN}
        ]
    },
    {
      id: 'calc_elspectra', name: 'Calculating ElSpectra', procType: EProcType.INTERNAL, custom: false,
      inputs:
        [ //container for required user inputs
          {name: "Tip Geometry", selectedValue: true, type: EInputFieldType.GEOMETRY},
          {name: "Radius", selectedValue: 1, type: EInputFieldType.NUMBER},
          {name: "Win", selectedValue: 100, type: EInputFieldType.NUMBER},
          {name: "Order", selectedValue: 2, type: EInputFieldType.NUMBER},
          {name: "Use Interpolation", selectedValue: false, type: EInputFieldType.BOOLEAN}
        ] // defaults: geometry='cylinder', radius=1, win=100, order=2, interp=False
    }
  ], // container for processes only run by the app but not selectable by the user
  test: []     //container for test processess
}
