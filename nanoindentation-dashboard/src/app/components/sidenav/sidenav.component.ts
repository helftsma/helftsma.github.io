import {Component} from '@angular/core';
import {GraphService} from "../../services/graph.service";
import {ProcessorService} from "../../services/processor.service";
import {EProcType} from "../../models/process.model";
import {EGeometryType} from "../../models/geometry.model";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  EProcType = EProcType;

  constructor(public graphService: GraphService,
              public processorService: ProcessorService) {
  }
}
