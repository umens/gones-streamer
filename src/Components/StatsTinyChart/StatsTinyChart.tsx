import React from 'react';
import { TinyColumn, TinyArea, TinyLine } from "@ant-design/charts";


type StatsTinyChartProps = {
  chartType: 'line' | 'bar' | 'area';
  data?: number[];
  maxY?: number;
  formatter?: (datum: any) => {
    name: string;
    value: string | number;
  };
  customContent?: (title: string, data: any[]) => string | HTMLElement;
}

const StatsTinyChart: React.FC<StatsTinyChartProps> = ({
  chartType,
  data,
  maxY = 100,
  formatter,
  customContent,
}) => {
  let chart;

  switch (chartType) {
    case 'area':
      chart = <TinyArea 
        // loading={data ? false : true}
        // autoFit={true}
        height={140}
        theme={'dark'}
        data={data ? data : []}
        smooth={true}
        yAxis={{
          max: maxY,
          min: 0,
        }}
        // animation={{ 
        //   appear : { 
        //     animation : 'path-in' , 
        //     duration : 5000 , 
        //   }
        // }}
        tooltip={{
          formatter,
          customContent,
        }}
      />;
      break;
    case 'bar':
      chart = <TinyColumn
        // loading={data ? false : true}
        // autoFit={true}
        height={140}
        data={data ? data : []}
        columnWidthRatio={1}
        theme={'dark'}
        // animation={{ 
        //   appear : { 
        //     animation : 'path-in' , 
        //     duration : 5000 , 
        //   }
        // }}
        tooltip={{
          formatter,
          customContent,
        }}
      />;
      break;
    case 'line':
    default:
      chart = <TinyLine
        // loading={data ? false : true}
        // autoFit={true}
        height={140}
        data={data ? data : []}
        smooth={true}
        theme={'dark'}
        yAxis={{
          max: maxY,
          min: 0,
        }}
        // animation={{ 
        //   appear : { 
        //     animation : 'path-in' , 
        //     duration : 5000 , 
        //   }
        // }}
        tooltip={{
          formatter,
          customContent,
        }}
      />;
      break;
  }
  return chart;
};

export { StatsTinyChart };