import React, { Component } from "react";
import { Datum, DatumValue, PointTooltip, ResponsiveLine } from "@nivo/line";
import { timeFormat } from "d3-time-format";
import * as time from 'd3-time';
import { linearGradientDef, ValueFormat } from "@nivo/core";

let commonProperties = {
  width: 100,
  height: 75,
  // margin: { top: 20, right: 20, bottom: 60, left: 80 },
  data: [{ x : new Date(), y: 0}],
  animate: true,
  enableSlices: 'x',
}

type RealTimeBarChartProps = {
  data: Datum[];
  tooltip?: PointTooltip;
  yFormat?: ValueFormat<DatumValue>
}
type RealTimeBarChartState = {
  data: Datum[];
  width: number;
}

class RealTimeBarChart extends Component<RealTimeBarChartProps, RealTimeBarChartState> {

  formatTime: (date: Date) => string;
  chartRef = React.createRef<HTMLDivElement>();

  constructor(props: RealTimeBarChartProps) {
    super(props);

    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    this.state = {
      data: this.props.data,
      width: 100,      
    };

    this.formatTime = timeFormat('%Y %b %d');
  }

  componentDidMount() {
    const width = this.chartRef.current?.parentElement?.parentElement?.parentElement?.offsetWidth! - 20;
    this.setState({ width }) 
    commonProperties.width = width;
  }

  componentWillUnmount() {
  }

  async componentDidUpdate(prevProps: {data: { x: Date, y: number }[]}) {
    if(prevProps.data[prevProps.data.length - 1] !== this.props.data[this.props.data.length - 1]) {
      const data = this.state.data.length >= 25 ? this.state.data.slice(1) : this.state.data;
      data.push({
        x: time.timeMillisecond.offset(this.props.data[this.props.data.length - 1].x as Date, 1000),
        y: this.props.data[this.props.data.length - 1].y,
      })
      await this.setState({ data });
    }
  }

  render() {
    const { data } = this.state

    return (
      <div ref={this.chartRef} className='realtimechart' style={{ height: 75, width: this.state.width }}>
        <ResponsiveLine
          {...commonProperties}
          enableArea={true}
          data={[
            { id: 'CPU', data },
          ]}
          defs={[
            linearGradientDef('gradientA', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
          xScale={{ type: 'time', format: 'native'  }}
          yScale={{ type: 'linear', min: 0 }}
          yFormat={this.props.yFormat}
          axisLeft={{}}
          axisBottom={{
              format: '%b %d',
              tickValues: 'every 1000 milliseconds',
          }}
          enablePoints={false}
          enablePointLabel={true}
          curve="step"
          animate={false}
          enableGridX={false}
          enableGridY={false}
          enableSlices={false}
          enableCrosshair={false}
          areaOpacity={1}
          useMesh={true}
          tooltip={this.props.tooltip}
          colors={() => '#177ddc'}
          
        />
      </div>
    )
  }
}

export { RealTimeBarChart };