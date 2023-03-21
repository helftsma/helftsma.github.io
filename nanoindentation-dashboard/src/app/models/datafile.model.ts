import {Dataset} from "./dataset.model";

// used to store uploaded datafiles
// children are multiple Datasets
export interface Datafile {
  name: string,
  datasets: Dataset[]
}
