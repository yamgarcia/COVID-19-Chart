import React, { useState, useEffect } from "react";
import { Chart } from "react-charts";
import axios from "axios";

const Home = () => {
  const [days, setDays] = useState([]);
  const [current, setCurrent] = useState(0);
  const [load, setLoad] = useState(true);

  async function loadDays() {
    days && setLoad(true);
    const response = await axios.get(
      "https://covidapi.info/api/v1/country/BRA"
    );
    try {
      const dataDay = response.data.result;
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

  const data = React.useMemo(
    () => [
      {
        label: "Series 1",
        data: [
          { x: 1, y: 12 },
          { x: 2, y: 15 },
          { x: 3, y: 11 },
        ],
      },
    ],
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  return (
    <div
      style={{
        width: "400px",
        height: "300px",
      }}
    >
      {console.log(days)}
      <Chart data={data} axes={axes} />
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
