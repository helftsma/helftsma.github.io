import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";
import {Datafile} from "../../../models/datafile.model";
import {ProcessorService} from "../../../services/processor.service";
import {EProcType} from "../../../models/process.model";

@Component({
  selector: 'app-files-tab',
  templateUrl: './files-tab.component.html',
  styleUrls: ['./files-tab.component.scss']
})
export class FilesTabComponent {
  tabOpen: boolean = false;

  selectedDatafile: Datafile;

  constructor(public graphService: GraphService,
              private processorService: ProcessorService) {
    if (this.graphService.selectedDatafile.datasets.length == 0) {
      this.tabOpen = true;
    }
  }

  // UPLOAD TXT FILES AND SEND TO BACKEND
  uploadHandler(event: any): void {
    const file = event.files && event.files[0];
    this.graphService.uploadDataTxt(file);
  }

  // TRIGGERED IF SELECTED DATAFILE CHANGES
  onSelectDatafile() {
    if (this.graphService.selectedDatafile.name != this.selectedDatafile.name) {
      this.graphService.selectedDatafile = this.selectedDatafile;
      this.graphService.selectedDatafile.datasets.forEach((dataset, index) => {
        this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = this.graphService.selectedDatafile.datasets[index].displacementForceData;
      })
      this.processorService.runFrom(EProcType.FILTER);
    }
  }

  // UPLOAD RAW FILES AND SEND TO BACKEND
  uploadrawHandler(event: any) {
    const file = event.files && event.files[0];
    this.graphService.uploadDataRaw(file);
  }
}
