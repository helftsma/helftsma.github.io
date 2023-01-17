import { Component, OnInit } from '@angular/core';

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';
//declare let loadPyodide: any;
import { loadPyodide } from "pyodide";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nanoindentation-dashboard';

  ngOnInit() {
    this.loadPy();
    
  }

  async loadPy() {

    loadPyodide({ indexURL: PYODIDE_BASE_URL }).then((pyodide) => {
      globalThis.pyodide = pyodide;

    })

    
    

    

    
  }


 

};

 /* async loadPy() {
    this.isLoading = true;
    loadPyodide({ indexURL: PYODIDE_BASE_URL }).then((pyodide) => {
      globalThis.pyodide = pyodide;
      this.isLoading = false;
  });
}

  async onClick(){
    this.renderChart();


  }  *)

};


 /* <div class="w-full h-full" style="padding: 4rem 7rem 4rem 7rem">

  <p-chart type="line"
           height="80vh"
           #chart
           [data]="basicData"
           [options]="basicOptions">
  </p-chart>

</div>  */

 

