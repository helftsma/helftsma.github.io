export interface CustomError {
  readonly id: number; // unique id to classify
  errType: EErrorType; // type of the error, needed for correct display in UI, find place in filesystem etc.
  readonly error: any; //error specified by TS
  readonly type: 'CustomError' | string; //type of obj itself used for error catching
  message?: string
}

export enum EErrorType { //Types of processes
  FATAL = 'fatal',
  RETRY = 'retry',
  TEST = 'test',

}
