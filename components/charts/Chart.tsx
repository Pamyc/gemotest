import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  options: any;
  height?: string;
}

export const Chart: React.FC<ChartProps> = ({ options, height = '400px' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }
      chartInstance.current.setOption(options);
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [options]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};