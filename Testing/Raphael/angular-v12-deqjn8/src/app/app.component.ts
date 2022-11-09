import { Component, OnInit, VERSION } from '@angular/core';
import { CENTROIDS, COUNTS } from './mocks';
import { getHistogram } from './python';
declare let loadPyodide: any;
const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.19.0/full/';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoading = false;
  centroids: string = null;
  counts: string = null;
  options: any;

  ngOnInit() {
    this.centroids = JSON.stringify(CENTROIDS);
    this.counts = JSON.stringify(COUNTS);
    this.loadPy();
  }

  async loadPy() {
    this.isLoading = true;
    loadPyodide({ indexURL: PYODIDE_BASE_URL }).then((pyodide) => {
      globalThis.pyodide = pyodide;
      this.isLoading = false;
    });
  }

  async onClick() {
    this.renderChart();
  }

  async renderChart() {
    const [ranges, values] = await getHistogram(
      this.centroids,
      this.counts,
      0,
      5
    );
    console.log(ranges, values);

    const source = values.map((value, i) => {
      return [ranges[i], value];
    });

    this.options = {
      ...this.getOptions(),
      dataset: [
        {
          source,
          dimensions: ['Residual', 'Count'],
        },
      ],
    };
  }

  private getOptions() {
    return {
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: '10%',
        top: 'top',
        feature: {
          mark: {
            show: false,
          },
          dataView: {
            show: false,
            readOnly: true,
          },
          dataZoom: {
            show: true,
            xAxisIndex: 0,
            yAxisIndex: false,
          },
          magicType: {
            show: false,
            type: ['line', 'bar', 'stack'],
          },
          restore: {
            show: false,
          },
          saveAsImage: {
            show: false,
          },
        },
      },
      legend: {
        type: 'scroll',
        show: false,
        orient: 'horizontal',
        right: 'auto',
        left: 'auto',
        top: 'auto',
        bottom: 'auto',
      },
      grid: {
        show: false,
        left: '10%',
        right: '12%',
        top: 60,
        bottom: 60,
        height: 'auto',
      },
      tooltip: {
        trigger: 'item',
        formatter: null,
        axisPointer: {
          type: 'cross',
        },
      },
      title: {
        text: 'Residuals Distribution',
        subtext: '(Residual = Actual - Predicted)',
        left: 'center',
      },
      xAxis: {
        type: 'category',
        name: 'Residual',
        splitLine: {
          show: true,
        },
        nameLocation: 'end',
        nameGap: 20,
        splitArea: {
          show: false,
        },
        axisLabel: {
          rotate: 20,
        },
        position: 'bottom',
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          verticalAlign: 'bottom',
          fontWeight: 'bold',
        },
      },
      yAxis: {
        type: 'value',
        name: 'Count',
        splitLine: {
          show: true,
        },
        nameLocation: 'end',
        nameGap: 20,
        splitArea: {
          show: false,
        },
        axisLabel: {
          rotate: 0,
        },
        position: 'left',
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          verticalAlign: 'bottom',
          fontWeight: 'bold',
        },
      },
      series: [
        {
          type: 'bar',
          stack: false,
          name: 'Count',
          encode: {
            x: 'Residual',
            y: 'Count',
            tooltip: ['', ''],
          },
          emphasis: {
            focus: 'series',
          },
          datasetIndex: 0,
          color: 'blue',
        },
      ],
    };
  }
}
