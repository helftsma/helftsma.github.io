import {Component} from '@angular/core';
import {GraphService} from "../../services/graph.service";

@Component({
  selector: 'app-bottomnav',
  templateUrl: './bottomnav.component.html',
  styleUrls: ['./bottomnav.component.scss']
})
export class BottomnavComponent {

  // FLOATING BOTTOM NAV
  // implements slider to slide through single curves
  // implements reset zoom of graphs

  constructor(public graphService: GraphService) {
  }
}
