import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function ColumnLine(props) {
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: "Sales and Target by Year",
      align: "left",
    },
    xAxis: {
      categories: ["2020", "2021", "2022"], // Add your country names here
    },
    yAxis: {
      title: {
        text: "Sales and Target",
      },
    },
    plotOptions: {
      series: {
        grouping: false,
        borderWidth: 0,
      },
    },

    tooltip: {
      shared: true,
      headerFormat:
        '<span style="font-size: 15px">' +
        "{series.chart.options.countries.(point.key).name}" +
        "</span><br/>",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> ' +
        "{series.name}: <b>{point.y}$</b><br/>",
    },

    series: [
      {
        name: "Target",
        data: props.data[1],

        type: "column",
        color: "#eaf6f6",
        linkedTo: "main20",
        pointPlacement: -0.2,
      },
      {
        name: "Amount",
        data: props.data[0],
        type: "column",
        color: "#66bfbf",
        id: "main20",
      },
    ],
  });

  return (
    <div>
      <figure className="highcharts-figure">
        <div id="parent-container">
          <div id="container">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </div>
        </div>
      </figure>
    </div>
  );
}
export default ColumnLine;
