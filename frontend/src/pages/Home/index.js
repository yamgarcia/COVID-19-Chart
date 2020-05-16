import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

// https://react-google-charts.com/geo-chart
// https://react-google-charts.com/

const Home = () => {
  const [days, setDays] = useState([]);
  const [cases, setCases] = useState([]);
  const [current, setCurrent] = useState(0);
  const [brazilTotal, setBrazilTotal] = useState(0);
  const [load, setLoad] = useState(true);
  const [allCountries, setAllCountries] = useState(
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", brazilTotal],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
    ["Qatar", brazilTotal],
    ["Bahrain", brazilTotal]
  );
  const countries = [
    "Germany",
    "United States",
    "Brazil",
    "Canada",
    "France",
    "RU",
    "Qatar",
    "Bahrain",
  ];

  // const all = allCountries.map((country) => [country]);

  const mapDataConfig = ["Country", "Infected"];

  const mapData = [mapDataConfig, ...allCountries];

  async function loadDays() {
    days && setLoad(true);

    try {
      const response = await axios.get(
        "https://covidapi.info/api/v1/country/BRA"
      );
      const dataCount = response.data.count;
      const dataDay = response.data.result;

      const array = [];
      Object.keys(dataDay).map((day, i) => {
        const caseObj = dataDay[day];
        array.push(caseObj);
        setBrazilTotal(dataDay[day].confirmed);
      });
      setCases(...cases, array);

      setDays(dataDay);
      setCurrent(dataCount);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function loadCountries() {
    try {
      const response = await axios.get("https://restcountries.eu/rest/v2/all");
      console.log(response.data);
      //TODO
      //! 0. (Do it before) Fix mapData to accept and array of arrays
      //! 1. Set array of countries as [countryName, countryCode  ]
      //! 2. Map through the array using the covidAPI with each code
      //! 3. For each iteration set an array of countries as [ countryName, countryValue]
      //! 4. Pass the array into mapData and cross your fingers
    } catch (e) {
      console.error(e.message);
    } finally {
      loadDays();
    }
  }

  useEffect(() => {
    loadCountries();
    // loadDays();
  }, [load]);

  return (
    <div
      style={{
        width: "700px",
        height: "auto",
      }}
    >
      {/* {console.log(cases)} */}
      <div className='App'>
        <Chart
          chartEvents={[
            {
              eventName: "select",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 0) return;
                const region = mapData[selection[0].row + 1];
                console.log("Selected : " + region);
              },
            },
          ]}
          chartType='GeoChart'
          width='100%'
          height='400px'
          data={mapData}
        />
      </div>
      <h3>Total Days: {current}</h3>

      <ul>
        {cases.length > 0 &&
          cases.map((day, i) => (
            <li key={i}>
              <span>{JSON.stringify(day.confirmed)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Home;

//? Once the map is done try using the same data to add the lineChart below
/*
  const lineData = [
    ["x", "Brazil", "USA", "France", "Russia"],
    [0, 0, 0, 0, 0],
    [1, 10, 5, 20, 5],
    [2, 23, 15, 5, 5],
    [3, 17, 9, 5, 15],
    [4, 18, 10, 5, 5],
    [5, 9, 5, 5, 15],
    [6, 11, 3, 5, 5],
    [7, 27, 19, 5, 15],
    [8, 27, 19, 5, 5],
    [9, 27, 19, 5, 5],
    [10, 28, 19, 5, 10],
  ];
*/

/* LINE CHART 

<Chart
  width={"600px"}
  height={"400px"}
  chartType='LineChart'
  loader={<div>Loading Chart</div>}
  data={lineData}
  options={{
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Infected",
    },
    series: {
      0: { curveType: "function" },
      1: { curveType: "function" },
      2: { curveType: "function" },
      3: { curveType: "function" },
      4: { curveType: "function" },
    },
  }}
/>
*/

/* MAP CHART */
