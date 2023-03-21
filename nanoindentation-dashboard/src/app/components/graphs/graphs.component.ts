import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../../services/graph.service';
import {UIChart} from "primeng/chart";
import {Subscription} from "rxjs";
import {ErrorHandlerService} from 'src/app/services/error-handler.service';

import {Chart} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {

  // CONTAINS ALL GRAPH WINDOWS
  // implements all 6 charts
  // sets the data accordingly


  @ViewChild("displacementForceFilteredChartMultiple") displacementForceFilteredChartMultiple: UIChart;
  @ViewChild("displacementForceFilteredChartSingle") displacementForceFilteredChartSingle: UIChart;
  @ViewChild("indentationForceChartMultiple") indentationForceChartMultiple: UIChart;
  @ViewChild("indentationForceChartSingle") indentationForceChartSingle: UIChart;
  @ViewChild("elSpectraChartMultiple") elSpectraChartMultiple: UIChart;
  @ViewChild("elSpectraChartSingle") elSpectraChartSingle: UIChart;

  graphOptions1: any;
  graphOptions2: any;
  graphOptions3: any;
  graphOptions4: any;
  graphOptions5: any;
  graphOptions6: any;

  errorMessage: string;
  displayGraphTutorial: boolean;
  displayTutorial: boolean;
  displayTutorial2: boolean;
  displayTutorial3: boolean;

  showGraphTutorial() {
    this.displayGraphTutorial = true;
    this.displayTutorial = false;
  }

  showTutorial() {
    this.displayGraphTutorial = false;
    this.displayTutorial2 = false;
    this.displayTutorial = true;
  }

  showTutorial2() {
    this.displayTutorial = false;
    this.displayTutorial2 = true;
    this.displayTutorial3 = false;
  }

  showTutorial3() {
    this.displayTutorial2 = false;
    this.displayTutorial3 = true;
  }

  closeTutorial() {
    this.displayTutorial3 = false;
  }

  displacementForceFilteredDataMultiple: any;
  displacementForceFilteredDataSingle: any;
  indentationForceDataMultiple: any;
  indentationForceDataSingle: any;
  elSpectraDataMultiple: any;
  elSpectraDataSingle: any;

  datasetsSubscription: Subscription;
  sliderValueSubscription: Subscription;

  constructor(public graphService: GraphService,
              public errorHandler: ErrorHandlerService) {
  }

  decimation = {
    // NOT USED
    // but left to be reimplemented if performance is not good enough in the future
    // enabled: true,
    // algorithm: 'min-max',
  };

  ngOnInit() {
    this.setGraphOptions();

    this.datasetsSubscription = this.graphService.selectedDatafile$.subscribe(() => {
      this.reloadMultipleLineGraphs();
    })

    this.sliderValueSubscription = this.graphService.sliderValue$.subscribe(() => {
      this.reloadSingleLineGraphs();
    })

    this.graphService.resetAllGraphZooms$.subscribe(() => {
      this.resetAllZooms();
    })
  }


  ngOnDestroy() {
    this.datasetsSubscription.unsubscribe();
    this.sliderValueSubscription.unsubscribe();
  }


  // settings for zoom plugin
  zoomOptions = {
    pan: {
      enabled: true,
      mode: 'xy',
    },
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: false
      },
    }
  };

  // checks the contrast between two colors
  checkContrast(colorA, colorB) {
    const foregroundLumiance = this.luminance(colorA);
    const backgroundLuminance = this.luminance(colorB);
    return backgroundLuminance < foregroundLumiance
      ? ((backgroundLuminance + 0.05) / (foregroundLumiance + 0.05))
      : ((foregroundLumiance + 0.05) / (backgroundLuminance + 0.05));
  }

  // calculates the luminance of an rgb color
  // RGB should be structures as [r, g, b]
  luminance(rgb) {
    const [r, g, b] = rgb.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  }

  getRBGfromHex(hex: string) {
    hex = hex.slice(1);
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return [r, g, b];
  }


  // sets all basic data for a new curve
  // assigns a random color fitting the color scheme
  getNewData(): any {
    let borderColor: string = null;
    let background: string = '#121212';

    do {
      borderColor = '#' + (0x1000000 + Math.random() * 0x00ff00).toString(16).substr(1, 6);
    }
    while (this.checkContrast(this.getRBGfromHex(borderColor), this.getRBGfromHex(background)) > 0.3);

    return {
      data: [],
      fill: false,
      borderColor: borderColor,
      tension: .4
    }
  }

  setDisplacementForceFilteredMultiple(): void {
    this.displacementForceFilteredDataMultiple = {
      labels: [],
      datasets: []
    };

    for (let dataset of this.graphService.selectedDatafile.datasets) {
      this.displacementForceFilteredDataMultiple.datasets.push(this.getNewData());
      this.displacementForceFilteredDataMultiple.datasets[this.displacementForceFilteredDataMultiple.datasets.length - 1].data = dataset.displacementForceFilteredData;
    }
    if (this.displacementForceFilteredChartMultiple) {
      this.displacementForceFilteredChartMultiple.reinit();
    }
  }

  setDisplacementForceFilteredSingle(): void {
    if (!this.displacementForceFilteredDataMultiple?.datasets || !this.displacementForceFilteredDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.displacementForceFilteredDataSingle = {
      labels: [],
      datasets: []
    };

    this.displacementForceFilteredDataSingle.datasets = [this.displacementForceFilteredDataMultiple.datasets[this.graphService.sliderValue]];
    if (this.displacementForceFilteredChartSingle) {
      this.displacementForceFilteredChartSingle.reinit();
    }
  }

  setIndentationForceMultiple(): void {
    this.indentationForceDataMultiple = {
      labels: [],
      datasets: []
    };
    for (let dataset of this.graphService.selectedDatafile.datasets) {
      this.indentationForceDataMultiple.datasets.push(this.getNewData());
      this.indentationForceDataMultiple.datasets[this.indentationForceDataMultiple.datasets.length - 1].data = dataset.indentationForceData;
    }
    if (this.indentationForceChartMultiple) {
      this.indentationForceChartMultiple.reinit();
    }
  }

  setIndentationForceSingle(): void {
    if (!this.indentationForceDataMultiple?.datasets || !this.indentationForceDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.indentationForceDataSingle = {
      labels: [],
      datasets: []
    };

    this.indentationForceDataSingle.datasets = [this.indentationForceDataMultiple.datasets[this.graphService.sliderValue]];
    if (this.indentationForceChartSingle) {
      this.indentationForceChartSingle.reinit();
    }
  }

  setElSpectraMultiple(): void {
    this.elSpectraDataMultiple = {
      labels: [],
      datasets: []
    };
    for (let dataset of this.graphService.selectedDatafile.datasets) {
      this.elSpectraDataMultiple.datasets.push(this.getNewData());
      this.elSpectraDataMultiple.datasets[this.elSpectraDataMultiple.datasets.length - 1].data = dataset.elspectraData;
    }
    if (this.elSpectraChartMultiple) {
      this.elSpectraChartMultiple.reinit();
    }
  }

  setElSpectraSingle(): void {
    if (!this.elSpectraDataMultiple?.datasets || !this.elSpectraDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.elSpectraDataSingle = {
      labels: [],
      datasets: []
    };

    this.elSpectraDataSingle.datasets = [this.elSpectraDataMultiple.datasets[this.graphService.sliderValue]];

    if (this.elSpectraChartSingle) {
      this.elSpectraChartSingle.reinit();
    }
  }

  reloadMultipleLineGraphs(): void {
    this.setDisplacementForceFilteredMultiple();
    this.setIndentationForceMultiple();
    this.setElSpectraMultiple();

    this.reloadSingleLineGraphs();
  }

  reloadSingleLineGraphs(): void {
    this.setDisplacementForceFilteredSingle();
    this.setIndentationForceSingle();
    this.setElSpectraSingle();
  }

  resetAllZooms() {
    if (this.displacementForceFilteredChartMultiple?.chart)
      this.displacementForceFilteredChartMultiple.chart.resetZoom();

    if (this.displacementForceFilteredChartSingle?.chart)
      this.displacementForceFilteredChartSingle.chart.resetZoom();

    if (this.indentationForceChartMultiple?.chart)
      this.indentationForceChartMultiple.chart.resetZoom();

    if (this.indentationForceChartSingle?.chart)
      this.indentationForceChartSingle.chart.resetZoom();

    if (this.elSpectraChartMultiple?.chart)
      this.elSpectraChartMultiple.chart.resetZoom();

    if (this.elSpectraChartSingle?.chart)
      this.elSpectraChartSingle.chart.resetZoom();

    this.setGraphOptions();
  }


  setGraphOptions(): void {
    const graphOptions = {
      indexAxis: "x",
      // Turn off animations and data parsing for performance
      animation: false,
      parsing: false,

      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      elements: {
        point: {
          radius: 0
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      plugins: {
        decimation: this.decimation,
        legend: {display: false},
        zoom: this.zoomOptions

      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#ebedef"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          },
          type: 'linear',
        },
        y: {
          stacked: true,
          ticks: {
            color: "#ebedef"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          }
        }
      }
    };

    // JSON stringify and parse used to destroy connections between the objects
    const graphOptionsString = JSON.stringify(graphOptions);
    this.graphOptions1 = JSON.parse(graphOptionsString);
    this.graphOptions2 = JSON.parse(graphOptionsString);
    this.graphOptions3 = JSON.parse(graphOptionsString);
    this.graphOptions4 = JSON.parse(graphOptionsString);
    this.graphOptions5 = JSON.parse(graphOptionsString);
    this.graphOptions6 = JSON.parse(graphOptionsString);
  }
}
