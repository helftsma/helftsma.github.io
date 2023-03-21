import {Injectable} from '@angular/core';
import {CustomError, EErrorType} from "../models/error.model";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  dialogShown: boolean;
  errorMessage: string;
  private errors: CustomError[] = []; //Container for errors
  private errorID: -1;    //ID that counts up for each error found

  //New error that id added to the container
  public newError(err: any, errType: EErrorType) {
    this.errors.push({id: this.errorID++, errType: errType, error: err, type: 'customerror', message: err.message}); //attatches 'customerror' typing to object
    this.dialogShown = true;
    this.errorMessage = ("Error: " + err.message + " was caught, skipping process");
    return this.errors[this.errors.length - 1];
  }

  //Retrieves error object by its ID
  public getError(id: number) {
    return this.errors[id];
  }

  //Changes Type of error
  public setType(err: CustomError, errType: EErrorType) {
    err.errType = errType;
    return err;
  }

  //Records a fatal error and adds to container
  public Fatal(error: any) {
    return this.newError(error, EErrorType.FATAL); //Adds error to record
  };

  //Records a non-fatal error and adds to container
  public Retry(error: any, attempt: number, max_attempt: number, errID?: number) {
    this.dialogShown = true;
    this.errorMessage = ("Error: " + error + " occurred. Attempting retry: " + attempt + 1 + "/" + max_attempt)
    if (attempt == 1) {
      return this.newError(error, EErrorType.RETRY);
    } else {
      return this.getError(errID);
    }
  };

  //Records a failed retry and changes type of error
  public RetryFailed(errID: number) {
    this.dialogShown = true;
    this.errorMessage = ("Max attempts reached. Quitting method.")
    let error = this.getError(errID);
    return this.setType(error, EErrorType.FATAL);
  };

  constructor() {
  }
}
