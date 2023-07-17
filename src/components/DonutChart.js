import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function DonutChart(props) {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const getSubtitle = (y, sum) => {
      return `
      
      <div style="text-align: center;">
      <h3>${y}</h3>
      <h4>Total: <b>${sum}</b> $</h4>
    </div>`;
    };

    const updatedChartOptions = {
      title: {
        text: 'Sales Percentage by Country',
        align: 'center',
      },
      subtitle: {
        useHTML: true,
        text: getSubtitle(props.year, props.sum),
        floating: true,
        verticalAlign: 'middle',
        y: 30,
      },
      tooltip: {
        pointFormat: '{series.data[1]}: <b>{point.percentage:.1f}%</b>',
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          colorByPoint: true,
          type: 'pie',
          size: '100%',
          innerSize: '80%',
          dataLabels: {
            enabled: true,
            crop: false,
            distance: '-10%',
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
            connectorWidth: 0,
          },
        },
      },
      colors: [
        '#fbb03b',
        '#223b53',
        '#FCE700',
        '#3bb2d0',
        '#BCE29E',
        '#ccc',
      ],
      series: [
        {
          type: 'pie',
          name: props.year,
          data: props.data.map((d) => [d[0].slice(0, 2), d[1]]),
        },
      ],
    };

    setChartOptions(updatedChartOptions);
  }, [props.year, props.sum, props.data]);

  
  return (
    <div>
      <figure className="highcharts-figure">
        <div id="parent-container">
          <div id="container">
            {chartOptions && (
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </figure>
    </div>
  );
}

export default DonutChart;
