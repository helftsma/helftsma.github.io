import {Component} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {GraphService} from "../../../services/graph.service";
import {EInputFieldType} from "../../../models/input.model";

@Component({
  selector: 'app-filters-tab',
  templateUrl: './filters-tab.component.html',
  styleUrls: ['./filters-tab.component.scss']
})
export class FiltersTabComponent {
  disabled: boolean = true;

  EInputFieldType = EInputFieldType;
  band: number = null;

  constructor(public processorService: ProcessorService,
              private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      this.disabled = !datafile.datasets.length;
    })
  }
}
