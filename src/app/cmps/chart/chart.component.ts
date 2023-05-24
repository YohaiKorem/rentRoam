import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartData } from 'src/app/models/chart-data.model';
import { ChartDataValue } from 'src/app/models/chartDataValue.model';
@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() chartData!: ChartDataValue[];

  ngOnInit(): void {
    const chart = document.getElementById('chart');
    console.log(this.chartData);
    new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.chartData.map((stay) => stay.price),
        datasets: [
          {
            label: 'count',
            data: this.chartData.map((stay) => stay.count),
            borderWidth: 2,
          },
        ],
      },
    });
  }
}
