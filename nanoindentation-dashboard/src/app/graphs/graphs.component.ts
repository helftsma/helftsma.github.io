import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../services/graph.service';
import {UIChart} from "primeng/chart";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  @ViewChild("chart") chart: UIChart;

  basicOptions;
  basicData;

  data: number[] = [124, 52, 51, 33, 53];

  constructor(private graphService: GraphService) {

    this.graphService.graphData$.subscribe((data) => {
      if (data?.Indentation) {
        this.basicData.datasets[0].data = data.Indentation;
        this.basicData.labels = data.Time;
        this.chart.reinit();
      }
    })

  }

  ngOnInit() {
    this.applyDarkTheme();
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: this.data,
          fill: false,
          borderColor: '#02ff0e',
          tension: .4
        },
      ]
    };

  }

  applyDarkTheme() {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };
  }

}
