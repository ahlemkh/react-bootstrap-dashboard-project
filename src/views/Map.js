/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
*/
import React from "react";
// reactstrap components
import { Button, Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import data from "./data.json";
import DonutChart from "../components/DonutChart";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWhsZW1raCIsImEiOiJjbDhsZ2Fwa2QwMzVmM3ZxaDkwZWl6amh3In0.dRzrp6_Biv8v2mJz83ucHA&types=adress";

const MapWrapper = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-10);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(0.75);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "winkelTripel",
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
            "#e55e5e",
            "United Kingdom",
            "#3bb2d0",
            "Canada",
            "red",
            /* other */ "#ccc",
          ],
          "circle-opacity": 0.75,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "Amount"],
            100,
            2,
            1000,
            8,
            200000,
            20,
          ],
        },
      });
      //return () => map.remove(); https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#interpolate
    });
  });

  return (
    <div
      className="map"
      style={{ position: "relative", height: `100%`, overflow: "hidden" }}
      ref={mapContainer}
    ></div>
  );
};


function Map() {
  const [year, setYear] = useState("2020");
  const [ tableData , settableData] = useState(getData("2020", data.features));
  const [sum, setSum] = useState(sumTab(tableData));
  const [ dataDonutChart , setDataDonutChart] = useState(getDataDonutChart(tableData,sum));


  const changeYear = (event) => {
    setYear(event.target.value);
    settableData(getData(year, data.features));
    setSum(sumTab(tableData));
    setDataDonutChart(getDataDonutChart(tableData,sum));
    
  };
  

 

  //const [amount, setAmount] = useState(getData("2020", data));

  //console.log(data.features);
  

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>Google Maps</CardHeader>
              <CardBody>
                <Row>
                  <Col md="3" className="mt-3">
                    <Row className="mx-auto">
                      <p>
                        <b>Financial Statistics</b>
                      </p>
                    </Row>
                    <Row className="mx-auto">
                      <h3>{sum} $</h3>
                    </Row>
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
                    <Row className="mt-3">
                      <Col md="12">
                       {dataDonutChart &&  <DonutChart year={year} sum= {sum } data ={dataDonutChart}/> } 
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col md="12">
                        {getData(year, data.features).map((data) => (
                          <Row key={data["0"]}>
                            <Col md="5" xs="4">
                              <p>{data["0"]}</p>
                            </Col>
                            <Col md="4" xs="4">
                              <p>{data["1"]}</p>
                            </Col>
                            <Col md="3" xs="4">
                              <p>{data["2"]}</p>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                    
                  </Col>
                  <Col md="9">
                    <MapWrapper />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
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
      return [Country, Amount, percentage];
    });

  return output;
}
const getDataDonutChart = (data,sum) =>{
 
  const output = data
    .map((row) => {
    
      const Country = row[0];
      
      const percentage = ((row[1] * 100) / sum).toFixed(1);
      return [Country, Number(percentage)];
    });

  return output;
}


function sumTab(data) {
  var sum = 0;
  const output = data.map((tab) => {
    const value = tab["1"];
    return [value];
  });
  for (let i = 0; i < output.length; i++) {
    sum += Number(output[i]);
  }

  return sum;
}
export default Map;

/*map.current.on("load", () => {
    map.current.addSource("earthquakes", {
      type: "geojson",
      data: data,
    });

    map.current.addLayer({
      id: "earthquake-circles",
      type: "circle",
      source: "earthquakes",
      layout: {},
      paint: {
        "fill-color": "#f08",
        "fill-opacity": 0.4,
      },
    });
  });*/

/*
const MapWrapper = () => {
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    let lat = "40.748817";
    let lng = "-73.985428";
    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
      styles: [
        {
          featureType: "water",
          stylers: [
            {
              saturation: 43
            },
            {
              lightness: -11
            },
            {
              hue: "#0088ff"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [
            {
              hue: "#ff0000"
            },
            {
              saturation: -100
            },
            {
              lightness: 99
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#808080"
            },
            {
              lightness: 54
            }
          ]
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ece2d9"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ccdca1"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#767676"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "poi",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [
            {
              visibility: "on"
            },
            {
              color: "#b8cb93"
            }
          ]
        },
        {
          featureType: "poi.park",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "poi.sports_complex",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "poi.medical",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "poi.business",
          stylers: [
            {
              visibility: "simplified"
            }
          ]
        }
      ]
    };

    map = new google.maps.Map(map, mapOptions);

    const marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: "Paper Dashboard React!"
    });

    const contentString =
      '<div class="info-window-content"><h2>Paper Dashboard React</h2>' +
      "<p>A free Admin for React, Reactstrap, and React Hooks.</p></div>";

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
  });
  return (
    <>
      <div style={{ height: `100%` }} ref={mapRef}></div>
    </>
  );
};*/
