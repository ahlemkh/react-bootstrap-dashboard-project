import React from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState , useEffect } from 'react';



function DonutChart(props) {

  /*const getSubtitle = (y,sum) => {
  
    return `<span style="font-size: 80px">${y}</span>
        <br>
        <span style="font-size: 22px">
            Total: <b> ${sum}</b> TWh
        </span>`;
  }
  subtitle: {
        useHTML: true,
        text: getSubtitle(props.year,props.sum),
        floating: true,
        verticalAlign: 'middle',
        y: 30
    },
    */
  
  console.log(props.data);
  const [chartOptions, setChartOptions] = useState( {
    title: {
        text: 'Amount  from 2020 to 2022',
        align: 'center'
    },


    legend: {
        enabled: false
    },

    tooltip: {
        valueDecimals: 1,
        valueSuffix: ' TWh'
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
                    fontSize: '16px'
                },
                connectorWidth: 0
            }
        }
    },
    colors: ['#FCE700', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E','#FCE700'],
    series: [
        {
            type: 'pie',
            name: props.year,
            data: props.data[1]
        }
    ]
});


 
    
  
console.log(chartOptions);

  

 
  return (
    <div>
    <figure className="highcharts-figure">
<div id="parent-container">

<div id="container">
{ chartOptions && <HighchartsReact
    
    highcharts={Highcharts}
    options={chartOptions}
  /> }
</div>
</div>
</figure>



</div>
  );
}

export default DonutChart;
