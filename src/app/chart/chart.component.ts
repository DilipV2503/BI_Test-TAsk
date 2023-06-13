import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  public chartData: any;

  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 22.726190587989446, 75.85493985240511 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
  public chartOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };
  chartLabels: string[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://data.covid19india.org/v4/min/timeseries.min.json')
      .subscribe((data: any) => {
        // Process the data and extract the necessary values for the chart
        const seriesA = Object.values(data['TT']['dates']).map((entry: any) => entry['delta']['confirmed']);
        const seriesB = Object.values(data['TT']['dates']).map((entry: any) => entry['delta']['deceased']);
        const labels = Object.keys(data['TT']['dates']);

        // Assign the processed data to the chart properties
        this.chartData = [
          { data: seriesA, label: 'Confirmed' },
          { data: seriesB, label: 'Deceased' }
        ];
        this.chartLabels = labels;
      });

      
  }

  ngAfterViewInit(){
    this.initMap();
  }
}
