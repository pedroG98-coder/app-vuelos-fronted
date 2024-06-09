import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement);


/**
 * Componente Vuelos Page
 */


function VuelosPage() {


  // Definimos los estados para almacenar datos
  const [data, setData] = useState([]);
  const [aeropuertosMasMovimiento, setAeropuertosMasMovimiento] = useState([]);
  const [aerolineaMayorMovimiento, setAerolineaMayorMovimiento] = useState("");
  const [diaMayorVuelosData, setDiaMayorVuelosData] = useState({});
  const [aerolineasMasDosVuelosPorDia, setAerolineasMasDosVuelosPorDia] =
    useState([]);


  // useEffect para obtener datos de las APIs
  useEffect(() => {

    // Fetch para obtener datos de vuelos
    fetch("http://127.0.0.1:8000/vuelo")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));

    // Fetch para obtener aeropuertos con mayor movimiento
    fetch("http://127.0.0.1:8000/helpers/aerolinea-mas-vuelos")
      .then((response) => response.json())
      .then((data) =>
        setAeropuertosMasMovimiento(data.aeropuertos_mas_movimiento)
      )
      .catch((error) => console.error("Error fetching data:", error));

    // Fetch para obtener la aerolínea con mayor movimiento del año
    fetch("http://127.0.0.1:8000/helpers/aerolinea-mayor-movimiento-anio")
      .then((response) => response.json())
      .then((data) =>
        setAerolineaMayorMovimiento(data.aerolinea_mayor_movimiento_año)
      )
      .catch((error) => console.error("Error fetching data:", error));


    // Fetch para obtener el día con mayor número de vuelos
    fetch("http://127.0.0.1:8000/helpers/dia-mayor-numero-vuelos")
      .then((response) => response.json())
      .then((data) => setDiaMayorVuelosData(data))
      .catch((error) => console.error("Error fetching data:", error));


      // Fetch para obtener aerolíneas con más de 2 vuelos por día
    fetch("http://127.0.0.1:8000/helpers/aerolineas-mas-dos-vuelos-por-dia")
      .then((response) => response.json())
      .then((data) =>
        setAerolineasMasDosVuelosPorDia(data.aerolineas_mas_dos_vuelos_por_dia)
      )
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  /**
   * Procesa los datos para la grafica  del endpoint aerolinea-mas-vuelos
   */

  const processAirportData = () => {
    const aeropuertos = {};
    data.forEach((vuelo) => {
      const nombreAeropuerto = vuelo.aeropuerto.nombre_aeropuerto;
      if (nombreAeropuerto in aeropuertos) {
        aeropuertos[nombreAeropuerto]++;
      } else {
        aeropuertos[nombreAeropuerto] = 1;
      }
    });

    const labels = Object.keys(aeropuertos);
    const dataValues = Object.values(aeropuertos);

    return {
      labels: labels,
      datasets: [
        {
          label: "Aeropuertos con mayor movimiento",
          data: dataValues,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };


  /**
   * Procesa los datos para la grafica  del endpoint aerolinea-mayor-movimiento-anio
   */


  const processAirlineData = () => {
    const aerolineas = {};
    data.forEach((vuelo) => {
      const nombreAerolinea = vuelo.aerolinea.nombre_aerolinea;
      if (nombreAerolinea in aerolineas) {
        aerolineas[nombreAerolinea]++;
      } else {
        aerolineas[nombreAerolinea] = 1;
      }
    });

    const labels = Object.keys(aerolineas);
    const dataValues = Object.values(aerolineas);

    return {
      labels: labels,
      datasets: [
        {
          label: "Aerolíneas con mayor número de vuelos",
          data: dataValues,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };


  /**
   * Procesa los datos para la grafica del endpoint dia-mayor-numero-vuelos
   */

  const processDayData = () => {
    const days = {};
    data.forEach((vuelo) => {
      const diaMayor = vuelo.dia;
      if (diaMayor in days) {
        days[diaMayor]++;
      } else {
        days[diaMayor] = 1;
      }
    });

    const labels = Object.keys(days);
    const dataValues = Object.values(days);

    return {
      labels: labels,
      datasets: [
        {
          label: "Día con Mayor Número de Vuelos",
          data: dataValues,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };


  /**
   * Procesa los datos para la grafica  del endpoint aerolineas-mas-dos-vuelos-por-dia
   */

  const processAirlineDosData = () => {
    const aerolineasDos = aerolineasMasDosVuelosPorDia.reduce(
      (aerolineas, aerolinea) => {
        aerolineas[aerolinea] = data.filter(
          (vuelo) => vuelo.aerolinea.nombre_aerolinea === aerolinea
        ).length;
        return aerolineas;
      },
      {}
    );

    const labels = Object.keys(aerolineasDos);
    const dataValues = Object.values(aerolineasDos);

    return {
      labels: labels,
      datasets: [
        {
          label: "Aerolíneas con más de 2 vuelos por día",
          data: dataValues,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
      ],
    };
  };



  return (


    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>
        Gráfico de Aeropuertos con Mayor Movimiento
      </h1>
      <p style={{ textAlign: "center" }}>
        ¿Cuál es el nombre del aeropuerto que ha tenido mayor movimiento durante
        el año?
      </p>
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={processAirportData()} />
      </div>
      <h2 style={{ textAlign: "center" }}>Resultado:</h2>
      <ul style={{ textAlign: "center" }}>
        {aeropuertosMasMovimiento.map((aeropuerto, index) => (
          <li key={index}>{aeropuerto}</li>
        ))}
      </ul>


      <p style={{ textAlign: "center" }}>
        ¿Cuál es el nombre de la aerolínea que ha realizado mayor número de
        vuelos durante el año?
      </p>
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={processAirlineData()} />
      </div>
      <h2 style={{ textAlign: "center" }}>Resultado:</h2>
      <ul style={{ textAlign: "center" }}>
        {Array.isArray(aerolineaMayorMovimiento) &&
          aerolineaMayorMovimiento.map((aerolinea, index) => (
            <li key={index}>{aerolinea}</li>
          ))}
      </ul>



      <p style={{ textAlign: "center" }}>
        ¿En qué día se han tenido mayor número de vuelos?
      </p>
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={processDayData()} />
      </div>
      <h2 style={{ textAlign: "center" }}>Resultado:</h2>
      <ul style={{ textAlign: "center" }}>
        <li>{diaMayorVuelosData.dia_mayor_numero_vuelos}</li>
      </ul>



      <p style={{ textAlign: "center" }}>
        ¿Cuáles son las aerolíneas que tienen más de 2 vuelos por día?
      </p>
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={processAirlineDosData()} />
      </div>
      <h2 style={{ textAlign: "center" }}>Resultado:</h2>
      <ul style={{ textAlign: "center" }}>
        {aerolineasMasDosVuelosPorDia.map((aerolinea, index) => (
          <li key={index}>{aerolinea}</li>
        ))}
      </ul>
    </div>
  );
}

export default VuelosPage;
