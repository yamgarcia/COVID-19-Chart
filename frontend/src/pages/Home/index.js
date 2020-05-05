import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

//https://react-google-charts.com/geo-chart

const Home = () => {
  const [days, setDays] = useState([]);
  const [cases, setCases] = useState([]);
  const [current, setCurrent] = useState(0);
  const [brazilTotal, setBrazilTotal] = useState(0);
  const [load, setLoad] = useState(true);

  const mapData = [
    ["Country", "Infected"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", brazilTotal],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
  ];
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
        console.log(brazilTotal);
        setBrazilTotal(dataDay[day].confirmed);
      });
      setCases(...cases, array);

      console.log(brazilTotal);

      setDays(dataDay);
      setCurrent(dataCount);
    } catch (e) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    loadDays();
  }, [load]);

  return (
    <div
      style={{
        width: "700px",
        height: "auto",
      }}
    >
      {/* LINE CHART */}

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

      {/* MAP CHART */}

      {console.log(cases)}
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
      {/* {console.log("infected")} */}
      <h3>Days</h3>
      <h3>Total: {current}</h3>
      {/* {infected &&
        Object.keys(days).map((day, i) => (
          <li key={i}>
            <span>{JSON.stringify(days[day].confirmed)}</span>
          </li>
        ))} */}
      {/* {infected && */}
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
