import {Component, ViewChild} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {saveAs} from 'file-saver';
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-download-settings-tab',
  templateUrl: './download-settings-tab.component.html',
  styleUrls: ['./download-settings-tab.component.scss']
})
export class DownloadSettingsTabComponent {
  @ViewChild('fileUpload') fileUpload: any;

  uploadSuccessfulMessage: string = '';
  disabled: boolean = true;

  constructor(private processorService: ProcessorService,
              private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      this.disabled = !datafile.datasets.length;
    })
  }

  // USED TO DOWNLOAD ALL SETTINGS AS A JSON IN A TEXT FILE
  downloadSettings() {
    let settingsObject: any = {
      availableProcesses: null,
      selectedFilters: null,
      selectedCPointProcess: null
    };

    settingsObject.availableProcesses = this.processorService.availableProcesses;
    settingsObject.selectedFilters = this.processorService.selectedFilters;
    settingsObject.selectedCPointProcess = this.processorService.selectedCPointProcess;

    let settingsString: string = JSON.stringify(settingsObject);
    const blob = new Blob([settingsString], {type: 'text/txt;charset=utf-8;'});
    saveAs(blob, 'nanoindentation-settings.txt')
  }


  // UPLOAD A PREVIOUSLY DOWNLOADED SETTINGS FILE TO APPLY SETTINGS
  uploadSettings(event: any) {
    let file: File = event.files[0];

    let fileReader = new FileReader();
    fileReader.onload = () => {
      let settings: string = fileReader.result as string;
      let settingsObject = JSON.parse(settings);
      this.processorService.updateSettings(settingsObject);
      this.uploadSuccessfulMessage = 'Settingsfile: ' + file.name + ' uploaded successfully ✔'
      this.fileUpload.clear()
    }

    fileReader.readAsText(file);
  }

}
