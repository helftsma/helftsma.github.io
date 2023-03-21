import {Component} from '@angular/core';
import {saveAs} from 'file-saver';
import {Datapoint} from 'src/app/models/datapoint.model';
import {GraphService} from 'src/app/services/graph.service';
import {ProcessorService} from 'src/app/services/processor.service';
import {GraphNumber} from 'src/app/models/graphNumber.model';
import {GraphSingle} from 'src/app/models/graphSingle.model';

@Component({
  selector: 'app-download-tab',
  templateUrl: './download-tab.component.html',
  styleUrls: ['./download-tab.component.scss']
})

export class DownloadTabComponent {
  graphOptions: GraphNumber[];
  selectedGraph: GraphNumber;
  graphSingle: GraphSingle[];
  selectedSingle: GraphSingle;

  constructor(public graphService: GraphService, public processorService: ProcessorService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
    this.graphOptions = [
      {name: "Force Displacement", no: 1},
      {name: "Force Indentation", no: 2},
      {name: "Elasticity Spectra", no: 3}
    ]
    this.graphSingle = [
      {name: "Multiple Curves", single: false},
      {name: "Single Curve", single: true},
    ]
  }

  disabled: boolean = true;

  download(): any {

    let Filename;

    let data: Datapoint[][] = [];

    // Sets correct filename
    if (this.selectedGraph.no == 1 && this.selectedSingle.single == false) {    //Force-Displacement
      Filename = "Force-Displacement.csv";
      this.graphService.selectedDatafile.datasets.forEach((dataset => {
        data.push(dataset.displacementForceData)
      }))
    } else if (this.selectedGraph.no == 1 && this.selectedSingle.single == true) { //Force-Displacement (single)
      Filename = "Force-Displacement (Single).csv"
      data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].displacementForceData)

    } else if (this.selectedGraph.no == 2 && this.selectedSingle.single == false) { //Force-Indentation
      Filename = "Force-Indentation.csv"
      this.graphService.selectedDatafile.datasets.forEach((dataset => {
        data.push(dataset.indentationForceData)
      }))
    } else if (this.selectedGraph.no == 2 && this.selectedSingle.single == true) { //Force-Indentation (single)
      Filename = "Force-Indentation (Single).csv"
      data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].indentationForceData)

    } else if (this.selectedGraph.no == 3 && this.selectedSingle.single == false) { // Elasticity-Spectra
      Filename = "Elasticity-Spectra.csv"
      this.graphService.selectedDatafile.datasets.forEach((dataset => {
        data.push(dataset.elspectraData)
      }))
    } else { // Elasticity-Spectra (single)
      Filename = "Elasticity-Spectra (Single).csv"
      data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].elspectraData)

    }


    // Create CSV
    // , as delimiter between columns
    // \n as delimiter for new rows
    // - for empty cells

    let xArray: number[][] = [];
    let yArray: number[][] = [];
    let longestAxis: number = 0;

    let csvString: string = '';

    for (let i = 0; i < data.length; i++) {
      if (i > 0) {
        csvString += ',';
      }
      csvString += 'x' + i + ',y' + i;

      let convertedData = this.processorService.convertDatapointsArrayToXAndYArray(data[i]);
      let xAxis = convertedData.x;
      let yAxis = convertedData.y;
      xArray.push(xAxis);
      yArray.push(yAxis);

      if (xAxis.length > longestAxis) {
        longestAxis = xAxis.length;
      }
      if (yAxis.length > longestAxis) {
        longestAxis = yAxis.length;
      }
    }

    csvString += '\n';

    for (let i = 0; i < longestAxis; i++) {
      for (let j = 0; j < xArray.length; j++) {
        if (xArray[j] && xArray[j][i]) {
          csvString += xArray[j][i];
        } else {
          csvString += '-';
        }
        csvString += ',';

        if (yArray[j] && yArray[j][i]) {
          csvString += yArray[j][i];
        } else {
          csvString += '-';
        }
        csvString += ','
      }
      csvString += '\n'
    }

    const csv = csvString;

    // SAVES CSV AS TEXT FILE
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    saveAs(blob, Filename);
  }
}
