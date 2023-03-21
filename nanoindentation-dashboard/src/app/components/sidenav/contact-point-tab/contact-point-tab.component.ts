import {Component} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {Process} from "../../../models/process.model";
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-contact-point-tab',
  templateUrl: './contact-point-tab.component.html',
  styleUrls: ['./contact-point-tab.component.scss']
})
export class ContactPointTabComponent {

  disabled: boolean = true;
  availableCPointProcesses: Process[];

  constructor(public processorService: ProcessorService,
              private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }

  ngOnInit() {
    this.availableCPointProcesses = this.processorService.availableProcesses.cPoints;
  }
}
