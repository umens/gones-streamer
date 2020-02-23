/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, OnChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../@core/utils';

@Component({
  selector: 'app-frames-pie-chart',
  styleUrls: ['./frames-metrics-card.component.scss'],
  template: `
    <div echarts
         class="echart"
         [options]="options"
         (chartInit)="onChartInit($event)"
         (chartClick)="onChartClick($event)">
    </div>
  `,
})
export class FramesPieChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Output() selectPie = new EventEmitter<{value: number; name: string; color: string}>();
  @Input() values: {value: number; name: string; }[];
  @Input() defaultSelectedCurrency: string;

  private alive = true;

  options: any;
  echartsInstance;

  constructor(
    private theme: NbThemeService,
    private layoutService: LayoutService
  ) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(): void {
    if (this.options) {
      this.updateChartOptions(this.values);
      const color = (this.defaultSelectedCurrency === 'Dropped Frames') ? '#00d68f' : '#3366ff';
      const value = (this.defaultSelectedCurrency === 'Dropped Frames') ? this.values[0].value : this.values[1].value;
      this.onChartClick({value, name: this.defaultSelectedCurrency, color: { colorStops : [ { color } ] } });
    }
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  onChartClick(event) {
    const pieData = {
      value: event.value,
      name: event.name,
      color: event.color.colorStops[0].color,
    };

    this.emitSelectPie(pieData);
  }

  emitSelectPie(pieData: {value: number; name: string; color: any}) {
    this.selectPie.emit(pieData);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const variables = config.variables;

        this.setChartOption(variables);

        // this.options = this.getOptions(variables);
        const defaultSelectedData =
          this.options.series[0].data.find((item) => item.name === this.defaultSelectedCurrency);
        const color = defaultSelectedData.itemStyle.normal.color.colorStops[0].color;
        const pieData = {
          value: defaultSelectedData.value,
          name: defaultSelectedData.name,
          color,
        };

        this.emitSelectPie(pieData);
      });
  }

  setChartOption(variables) {
    const framesPie: any = variables.earningPie;

    this.options = {
      tooltip: {
        trigger: 'item',
        formatter: '',
      },
      series: [
        {
          name: ' ',
          clockWise: true,
          hoverAnimation: false,
          type: 'pie',
          center: framesPie.center,
          radius: framesPie.radius,
          data: [
            {
              value: this.values[0].value,
              name: this.values[0].name,
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: framesPie.firstPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: framesPie.firstPieGradientRight,
                    },
                  ]),
                  shadowColor: framesPie.firstPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
            {
              value: this.values[1].value,
              name: this.values[1].name,
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: framesPie.secondPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: framesPie.secondPieGradientRight,
                    },
                  ]),
                  shadowColor: framesPie.secondPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            }
          ],
        },
      ],
    };
  }

  updateChartOptions(chartData: { value: number; name: string; }[]) {
    const chartDatas = this.options.series[0].data;
    chartDatas[0].value = chartData[0].value;
    chartDatas[1].value = chartData[1].value;
    this.echartsInstance.setOption({
      series: [{
        data: chartDatas,
      }],
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}
