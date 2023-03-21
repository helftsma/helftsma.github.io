import {Component} from '@angular/core';
import {ProcessorService} from "./services/processor.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nanoindentation-dashboard';

  constructor(public processorService: ProcessorService) {
  }
}
