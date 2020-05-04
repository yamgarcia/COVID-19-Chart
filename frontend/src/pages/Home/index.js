import React, { useState, useEffect } from "react";
import axios from "axios";
import { render } from "react-dom";
import { Chart } from "react-google-charts";

//https://react-google-charts.com/geo-chart

const Home = () => {
  const [days, setDays] = useState([]);
  const [infected, setInfected] = useState([]);
  const [current, setCurrent] = useState(0);
  const [load, setLoad] = useState(true);

  const data = [
    ["Country", "Popularity"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", 400],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
  ];

  async function loadDays() {
    days && setLoad(true);
    const response = await axios.get(
      "https://covidapi.info/api/v1/country/BRA"
    );
    try {
      const dataDay = response.data.result;
      const dataInfected = Object.entries(dataDay).map((day, i) => {
        setInfected(day[1].confirmed);
        console.log(day[1].confirmed);
      });
      console.log(infected);
      const dataCount = response.data.count;
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
        width: "400px",
        height: "300px",
      }}
    >
      <div className='App'>
        <Chart
          chartEvents={[
            {
              eventName: "select",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 0) return;
                const region = data[selection[0].row + 1];
                console.log("Selected : " + region);
              },
            },
          ]}
          chartType='GeoChart'
          width='100%'
          height='400px'
          data={data}
        />
      </div>
      {console.log(days)}
      <h3>Days</h3>
      <h3>Total: {current}</h3>
      {Object.keys(days).map((day, i) => (
        <li key={i}>
          <span>{day}</span>
        </li>
      ))}
    </div>
  );
};

export default Home;
