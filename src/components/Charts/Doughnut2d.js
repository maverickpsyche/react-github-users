import React from "react";

import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Stars Per Language",
        showPercentValues: 0,
        decimals: 0,
        doughnuRadius: "45%",
        theme: "candy",
      },
      data,
    },
  };

  return <ReactFC {...chartConfigs} />;
};
export default ChartComponent;
