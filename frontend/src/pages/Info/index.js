import React, { useState, useEffect } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import countries from "./world_countries.json";

async function loadCountries() {
  const response = await axios.get("https://restcountries.eu/rest/v2/all");
  const countriesArrayCode = response.data.map((country) => {
    return {
      alpha2Code: country.alpha2Code,
      alpha3Code: country.alpha3Code,
      name: country.name,
    };
  });
  return countriesArrayCode;
}

async function insertInfected(allCountriesAPICode) {
  const response = await axios.get(
    "https://covidapi.info/api/v1/global/latest"
  );
  const results = response.data.result;
  const parsedResults = results.map((result) => {
    const key = Object.keys(result)[0];
    const countryCode = allCountriesAPICode.find(
      (country) => country.alpha3Code === key
    );
    if (countryCode) {
      return { id: countryCode.alpha3Code, value: result[key].confirmed };
    }
    return undefined;
  });
  return [...parsedResults.filter((res) => res !== undefined)];
}

const Info = () => {
  const [daysData, setDaysData] = useState();
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    async function getAPIData() {
      const allCountriesAPICode = await loadCountries();
      setMapData(await insertInfected(allCountriesAPICode));
    }
    getAPIData();
  }, []);

  async function loadDays(countryData) {
    const { data } = await axios.get(
      `https://covidapi.info/api/v1/country/${countryData.id}`
    );
    const parsedData = [
      {
        id: countryData.label,
        data: Object.keys(data.result).map((key) => {
          const date = key.split("-");
          const formattedDay = `${date[2]}/${date[1]}`;
          return {
            x: formattedDay,
            y: data.result[key].confirmed,
          };
        }),
      },
    ];
    console.log(parsedData);
    setDaysData(parsedData);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
      }}
    >
      {mapData && mapData.length === 0 && <p>Loading map...</p>}
      {mapData.length > 0 && (
        <div style={{ height: "400px" }}>
          <MyResponsiveChoropleth
            data={mapData}
            onClick={(selected) => loadDays(selected)}
          />
        </div>
      )}
      {daysData && (
        <div style={{ height: "500px" }}>
          <h3>{daysData[0].id}</h3>
          <MyResponsiveLine data={daysData} />
        </div>
      )}
    </div>
  );
};
export default Info;

const MyResponsiveChoropleth = ({ data, onClick }) => (
  <ResponsiveChoropleth
    data={data}
    onClick={onClick}
    features={countries.features}
    colors='reds'
    domain={[0, 1000000]}
    unknownColor='#666666'
    label='properties.name'
    valueFormat='.2s'
    projectionTranslation={[0.5, 0.5]}
    enableGraticule={true}
    graticuleLineColor='#dddddd'
    borderWidth={0.5}
    borderColor='#152538'
    legends={[
      {
        anchor: "bottom-left",
        direction: "column",
        justify: true,
        translateX: 20,
        translateY: -100,
        itemsSpacing: 0,
        itemWidth: 94,
        itemHeight: 18,
        itemDirection: "left-to-right",
        itemTextColor: "#444444",
        itemOpacity: 0.85,
        symbolSize: 18,
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000000",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "date",
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "infected",
      legendOffset: -40,
      legendPosition: "middle",
    }}
    colors={{ scheme: "nivo" }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel='y'
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);
