import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../logo.svg";
import { Chart } from "react-google-charts";

// https://react-google-charts.com/geo-chart
// https://react-google-charts.com/

const Home = () => {
  const [load, setLoad] = useState(false);
  const [allCountriesAPI, setAllCountriesAPI] = useState([]);
  const [allCountriesAPICode, setAllCountriesAPICode] = useState([]);
  const mapDataConfig = ["Country", "Confirmed Cases"];

  useEffect(() => {
    loadCountries();
  }, [load]);

  /*
    Populates allCountriesAPI and allCountriesAPICode and setLoad to true and then runs:
    insertInfected();
  */
  const loadCountries = async () => {
    try {
      const { data } = await axios.get("https://restcountries.eu/rest/v2/all");

      //? get the codes into countriesArrayCode array
      const countriesArrayCode = [];
      countriesArrayCode.length === 0 &&
        data.map((country) => {
          let countryCode = country.alpha3Code;
          let countryName = country.name;
          if (countryName === "United States of America")
            countryName = "United States";
          if (countryName === "Russian Federation") countryName = "Russia";
          if (countryName === "Côte d'Ivoire") countryName = "CI";
          if (countryName === "South Sudan") countryName = "SS";
          if (countryName === "Tanzania, United Republic of")
            countryName = "Tanzania";
          if (countryName === "Moldova (Republic of)") countryName = "Moldova";
          if (countryName === "Congo (Democratic Republic of the)")
            countryName = "CD";
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
      insertInfected();
    }
  };

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
      if (allCountriesAPI) return setLoad(true);
    }
  }

  return (
    <div
      style={{
        width: "700px",
        height: "auto",
        textAllign: "center",
      }}
    >
      {load ? (
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
                },
              },
            ]}
            chartType='GeoChart'
            width='100%'
            height='400px'
            data={allCountriesAPI}
          />
        </div>
      ) : (
        <>
          <img src={logo} className='App-logo' alt='logo' />
        </>
      )}
    </div>
  );
};

export default Home;
