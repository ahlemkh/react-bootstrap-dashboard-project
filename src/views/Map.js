import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import data from "./data.json";
import DonutChart from "../components/DonutChart";
import ColumnLine from "../components/ColumnLine";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWhsZW1raCIsImEiOiJjbDhsZ2Fwa2QwMzVmM3ZxaDkwZWl6amh3In0.dRzrp6_Biv8v2mJz83ucHA&types=adress";

const MapWrapper = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-10);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(0.4);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "equirectangular",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.addSource("amount-data", {
        type: "geojson",
        data: data,
      });

      map.current.addLayer({
        id: "amount-circles",
        type: "circle",
        source: "amount-data",
        layout: {},
        paint: {
          "circle-color": [
            "match",
            ["get", "Country"],
            "Egypt",
            "#fbb03b",
            "Algeria",
            "#223b53",
            "Russia",
            "#FCE700",
            "United Kingdom",
            "#3bb2d0",
            "Canada",
            "#ccc",
            /* other */ "#BCE29E",
          ],
          "circle-opacity": 0.75,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "Amount"],
            1000,
            2,
            10000,
            5,
            100000,
            12,
            600000,
            20,
          ],
        },
      });
    });

    return () => {
      map.current.remove(); // cleanup map instance
    };
  }, []);

  useEffect(() => {
    if (!map.current) return; // map is not yet initialized
    if (!map.current.isStyleLoaded()) return;

    const filterByYear = ["==", ["get", "Year"], props.year];

    map.current.setFilter("amount-circles", filterByYear);

    /* const zoomToYear = props.year === "2020" ? 0.75 : 0.5;
    map.current.zoomTo(zoomToYear, { duration: 500 });*/

    const circleRadiusExpression = [
      "interpolate",
      ["linear"],
      ["get", "Amount"],
      1000,
      2,
      10000,
      5,
      100000,
      12,
      600000,
      20,
    ];
    map.current.setPaintProperty(
      "amount-circles",
      "circle-radius",
      circleRadiusExpression
    );
  }, [props.year]);

  return (
    <div
      className="map"
      style={{ position: "relative", height: "400px", overflow: "hidden" }}
      ref={mapContainer}
    ></div>
  );
};

function Map() {
  const [year, setYear] = useState("2020");
  const [mapData, setMapData] = useState({
    tableData: getData("2020", data.features),
    sum: sumTab(getData("2020", data.features)),
    dataDonutChart: getDataDonutChart(
      getData("2020", data.features),
      sumTab(getData("2020", data.features))
    ),
  });

  const changeYear = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    const tableData = getData(year, data.features);
    const sum = sumTab(tableData);
    const dataDonutChart = getDataDonutChart(tableData, sum);

    setMapData({ tableData, sum, dataDonutChart });
  }, [year]);

  const { tableData, sum, dataDonutChart } = mapData;

  //const [amount, setAmount] = useState(getData("2020", data));

  return (
    <div className="content">
      <Row>
        <Col md="6">
          {/* map */}
          <Row>
            <Col md="12">
              <CardHeader>
                <CardTitle tag="h5">Sale Distribution By Year</CardTitle>
              </CardHeader>
              <Card>
                <CardBody style={{ height: "500 px" }}>
                  <MapWrapper year={year} />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* table */}
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Country</th>
                        <th>Sales</th>
                        <th>Target</th>
                        <th>% of goal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getData(year, data.features).map((data) => (
                        <tr key={data["0"]}>
                          <td>{data["0"]}</td>
                          <td>{data["1"]}</td>
                          <td>{data["2"]}</td>
                          <td>{data["3"]} %</td>
                          <td>
                            {data["3"] >= 100 ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#28a745"
                                className="bi bi-arrow-up-circle-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#dc3545"
                                className="bi bi-arrow-down-circle-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
                              </svg>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col md="6">
          {/* total amount */}
          <Row>
            <Col md="12">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Total Sales</p>
                        <CardTitle tag="p">$ {sum}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> By Year
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>

          {/* Year */}

          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <b>Year</b>
                </CardHeader>
                <CardBody>
                  <Row className="mx-auto">
                    <Button
                      size="sm"
                      className={
                        year === "2020"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                    >
                      2020
                    </Button>
                    <Button
                      size="sm"
                      className={
                        year === "2021"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                    >
                      2021
                    </Button>
                    <Button
                      size="sm"
                      className={
                        year === "2022"
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                    >
                      2022
                    </Button>
                  </Row>
                  <Row className="mx-auto">
                    <input
                      type="range"
                      onChange={changeYear}
                      min={2020}
                      max={2022}
                      step={1}
                      value={year}
                      className="custom-slider"
                      style={{ accentColor: "#51cbce" }}
                    ></input>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Donut chart */}
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  {dataDonutChart && (
                    <DonutChart year={year} sum={sum} data={dataDonutChart} />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          {/* column chart */}

          <Card>
            <CardBody>
              <ColumnLine data={getDataColumnChart(data)} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
function getData(year, features) {
  const output = features
    .filter((feature) => feature.properties.Year === year)
    .map((feature) => {
      //console.log(Object.entries(feature.properties));
      const Country = feature.properties.Country;
      const Amount = feature.properties.Amount;
      const Target = feature.properties.Target;
      const percentage = ((Amount * 100) / Target).toFixed(1);
      return [Country, Amount, Target, percentage];
    });

  return output;
}
const getDataColumnChart = (data) => {
  const dataTarget = [];
  const dataAmount = [];
  const years = ["2020", "2021", "2022"];
  var allData = [];
  var sumTarget = 0;
  var sumAmount = 0;

  for (let i = 0; i < years.length; i++) {
    allData = getData(years[i], data.features);

    sumTarget = 0;
    sumAmount = 0;

    for (let j = 0; j < allData.length; j++) {
      sumTarget += sumTarget + allData[j][2];
      sumAmount += sumAmount + allData[j][1];
    }
    dataTarget[i] = sumTarget;
    dataAmount[i] = sumAmount;
  }

  return [dataAmount, dataTarget];
};
const getDataDonutChart = (data, sum) => {
  const output = data.map((row) => {
    const Country = row[0];

    const percentage = ((row[1] * 100) / sum).toFixed(1);
    return [Country, Number(percentage)];
  });

  return output;
};

function sumTab(data) {
  var sum = 0;
  const output = data.map((tab) => {
    const value = tab[1];
    return [value];
  });
  for (let i = 0; i < output.length; i++) {
    sum += Number(output[i]);
  }

  return sum;
}
export default Map;
