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
  const mapDataConfig = ["Country", "Confirmed Cases"];

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

      //? get the codes into countriesArrayCode array
      const countriesArrayCode = [];
      countriesArrayCode.length === 0 &&
        response.data.map((country) => {
          let countryCode = country.alpha3Code;
          let countryName = country.name;
          if (countryName === "United States of America")
            countryName = "United States";
          if (countryName === "Russian Federation") countryName = "Russia";
          if (countryName === "Tanzania, United Republic of")
            countryName = "Tanzania";
          if (countryName === "Moldova (Republic of)") countryName = "Moldova";
          if (countryName === "Congo (Democratic Republic of the)")
            countryName = "Democratic Republic of the Congo";
          if (countryName === "Macedonia (the former Yugoslav Republic of)")
            countryName = "Macedonia";
          if (countryName === "Viet Nam") countryName = "Vietnam";
          if (countryName === "Syrian Arab Republic") countryName = "Syria";
          if (countryName === "Lao People's Democratic Republic")
            countryName = "Laos";
          if (countryName === "Venezuela (Bolivarian Republic of)")
            countryName = "Venezuela";
          if (countryName === "Bolivia (Plurinational State of)")
            countryName = "Bolivia";
          if (countryName === "Iran (Islamic Republic of)")
            countryName = "Iran";
          if (
            countryName ===
            "United Kingdom of Great Britain and Northern Ireland"
          )
            countryName = "United Kingdom";
          if (countryName === "Korea (Republic of)")
            countryName = "South Korea";
          return countriesArrayCode.push(...allCountriesAPICode, [
            countryCode,
            countryName,
          ]);
        });
      allCountriesAPICode.length === 0 &&
        setAllCountriesAPICode(countriesArrayCode);
    } catch (e) {
      console.error(e.message);
    } finally {
      loadDays();
      insertInfected();
    }
  }

  /*
    loads the infected number for each country
  */
  async function insertInfected() {
    let arrayOfCountries = [mapDataConfig];
    try {
      allCountriesAPICode.map((countryCode) => {
        axios
          .get(`https://covidapi.info/api/v1/country/${countryCode[0]}/latest`)
          .then((response) => {
            var countriesData = response.data.result;
            Object.keys(countriesData).map((countryData) => {
              let infectedByCountry = countriesData[countryData].confirmed;
              let countryElement = [countryCode[1], infectedByCountry];
              arrayOfCountries.push(countryElement);
              return setAllCountriesAPI(arrayOfCountries);
            });
          })
          .catch((e) => {});
      });
    } catch (e) {
      console.error(e.message);
    } finally {
      setTimeout(() => {
        if (allCountriesAPI) return setLoad(true), 2000;
      });
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
                  const region = allCountriesAPI[selection[0].row + 1];
                  console.log("Selected : " + region);
                },
              },
            ]}
            chartType='GeoChart'
            width='100%'
            height='400px'
            data={allCountriesAPI}
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
