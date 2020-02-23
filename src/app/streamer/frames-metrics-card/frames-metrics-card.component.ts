import { Component, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-frames-metrics-card',
  styleUrls: ['./frames-metrics-card.component.scss'],
  templateUrl: './frames-metrics-card.component.html',
})
export class FramesMetricsCardComponent implements OnDestroy {
  private alive = true;

  @Input() framesPieChartData: {
    value: number;
    name: string;
  }[];
  name: string;
  color: string;
  value: number;
  defaultSelectedCurrency = 'Dropped Frames';

  constructor() {}

  changeChartInfo(pieData: {value: number; name: string; color: any}) {
    this.value = pieData.value;
    this.name = pieData.name;
    this.color = pieData.color;
    this.defaultSelectedCurrency = pieData.name;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
