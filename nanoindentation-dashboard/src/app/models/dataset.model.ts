import {Datapoint} from "./datapoint.model";

// dataset contains all curves related to a single dataset
// parent: Datafile
// children: Datapoints
export interface Dataset {
  contactPoint: Datapoint;
  displacementForceData: Datapoint[];
  displacementForceFilteredData: Datapoint[];
  indentationForceData: Datapoint[];
  elspectraData: Datapoint[];
  testData: Datapoint[];
}
