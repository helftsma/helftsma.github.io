// parent: process
export interface Input {
  name: string; //Name of input field
  selectedValue: any; //selected value of input field
  type: EInputFieldType; //type of input expected
}

export enum EInputFieldType { //Types of inputs
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  GEOMETRY = 'geometry',
  DATAPOINT = 'datapoint'
}

