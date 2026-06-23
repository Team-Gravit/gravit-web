export interface ChartConfig {
  width: number;
  height: number;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  yAxisLabelOffset: number;
  yAxisLineOverFlow: number;
}

export const desktopChartConfig = {
  width: 1100,
  height: 300,
  padding: {
    left: 86,
    right: 20,
    top: 34,
    bottom: 58,
  },
  yAxisLabelOffset: 55,
  yAxisLineOverFlow: 24,
};

export const mobileChartConfig = {
  width: 375,
  height: 200,
  padding: {
    left: 35,
    right: 20,
    top: 30,
    bottom: 36,
  },
  yAxisLabelOffset: 17,
  yAxisLineOverFlow: 10,
};

export const chartColors = {
  brand: '#9B00CF',
  brandLight: '#BA00FF',
  labelColor: '#646464',
  lineColor: '#DCDCDC',
};
