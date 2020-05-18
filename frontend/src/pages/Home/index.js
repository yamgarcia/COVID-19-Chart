import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

// https://react-google-charts.com/geo-chart
// https://react-google-charts.com/

const Home = () => {
  const [cases, setCases] = useState([]);
  const [current, setCurrent] = useState(0);
  const [brazilTotal, setBrazilTotal] = useState(0);
  const [load, setLoad] = useState(false);
  const [allCountriesAPI, setAllCountriesAPI] = useState([]);
  const [allCountriesAPICode, setAllCountriesAPICode] = useState([]);

  //! Replace this variable with allCountriesAPI once it's populated
  const allCountries = [
    ["Germany", 200000],
    ["United States", 250000],
    ["Brazil", brazilTotal],
    ["Canada", 150000],
    ["France", 100000],
    ["RU", 300000],
  ];
  const mapDataConfig = ["Country", "Infected"];
  const mapData = [mapDataConfig, ...allCountries];

  useEffect(() => {
    loadCountries();
  }, [load]);

  /*
    Populates allCountriesAPI and allCountriesAPICode and setLoad to true and then runs:
    loadDays();
    insertInfected();
  */
  async function loadCountries() {
    try {
      const response = await axios.get("https://restcountries.eu/rest/v2/all");

      //? get the country names into allCountriesAPI array
      const countriesArray = [];
      response.data.map((country) => {
        return countriesArray.push([...allCountriesAPI, country.name]);
      });
      setAllCountriesAPI(countriesArray);

      //? get the codes into countriesArrayCode array
      const countriesArrayCode = [];
      response.data.map((country) => {
        return countriesArrayCode.push(...allCountriesAPICode, [
          country.alpha3Code,
          country.name,
        ]);
      });
      setAllCountriesAPICode(countriesArrayCode);

      setTimeout(() => console.log(allCountriesAPI), 5000);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoad(true);
      loadDays();
      insertInfected();
    }
  }

  /*
    loads the infected number for each country
  */
  async function insertInfected() {
    try {
      allCountriesAPICode.map((countryCode) => {
        console.log(countryCode[0]);
        const response = async () =>
          await axios.get(
            `https://covidapi.info/api/v1/country/${countryCode[0]}`
          );
        console.log(response);
        if (!response) return 0;
        const dataDay = response.data.result;
        let countryValue = 0;

        Object.keys(dataDay).map((day, i) => {
          return (countryValue = dataDay[day].confirmed);
        });
        allCountriesAPI.map((country) => {
          console.log(country);
          if (!country[1]) country[1] = countryValue;
        });
        return 0;
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  /*
  loads the cases and for now the brazil number of infected
  */
  async function loadDays() {
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
        return setBrazilTotal(dataDay[day].confirmed);
      });
      setCases(...cases, array);

      setCurrent(dataCount);
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div
      style={{
        width: "700px",
        height: "auto",
      }}
    >
      {/* {console.log(allCountriesAPI)} */}
      {load && (
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
      )}
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
