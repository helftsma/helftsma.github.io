import {Component, ViewChild} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {Process, EProcType} from 'src/app/models/process.model';
import {ProcessType} from 'src/app/models/processType.model';

@Component({
  selector: 'app-custom-code-tab',
  templateUrl: './custom-code-tab.component.html',
  styleUrls: ['./custom-code-tab.component.scss']
})

export class CustomCodeTabComponent {
  @ViewChild('fileUpload') fileUpload: any;

  loading: boolean = false;

  uploadSuccessfulMessage: string = '';

  selectedProcessType: ProcessType;
  processOptions: ProcessType[];

  constructor(private processorService: ProcessorService) {
    this.processOptions = [
      {name: "Filter", procType: EProcType.FILTER},
      {name: "CPoint", procType: EProcType.CPOINT}
    ]
  }

  uploadCodeHandler(event: any): void {
    this.loading = true;

    let file: File = event.files[0];

    let process: Process = {
      id: file.name,
      name: file.name,
      custom: true,
      procType: this.selectedProcessType.procType
    }

    let fileReader = new FileReader();
    fileReader.onload = () => {
      process.script = fileReader.result as string;
      this.uploadSuccessfulMessage = 'Process: ' + process.name + ' uploaded successfully ✔'

      this.loading = false;
      this.processorService.addProcess(process);
      this.fileUpload.clear()
    }

    fileReader.readAsText(file);
  }
}
