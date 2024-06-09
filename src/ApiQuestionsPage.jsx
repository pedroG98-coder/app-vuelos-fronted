import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

import api from './api';

Chart.register(CategoryScale, LinearScale, BarElement);


/**
 * Componente ApiQuestion Page
 */


function ApiQuestionsPage() {

  // Definimos los estados para almacenar datos
  const [data, setData] = useState(null);
  const [respuestaReputacion, setRespuestaReputacion] = useState('');
  const [maxReputation, setMaxReputation] = useState(0);
  const [minViewsResponse, setMinViewsResponse] = useState(null);
  const [respuestaMasViejaMasActual, setMasViejaMasActual] = useState(null);


  // useEffect para obtener datos de las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('helpers/obtener-respuestas-contestadas-no-contestadas');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  // useEffect para obtener datos de las APIs
  useEffect(() => {
    const fetchRespuestaReputacion = async () => {
      try {
        const response = await api.get('helpers/obtener-respuesta-mayor-reputacion');
        const { owner } = response.data;
        const maxRep = owner.reputation;
        setMaxReputation(maxRep);
        setRespuestaReputacion(`Reputación del usuario con mayor reputación: ${maxRep}`);
      } catch (error) {
        console.error('Error fetching respuesta reputacion:', error);
      }
    };

    fetchRespuestaReputacion();
  }, []);


  // useEffect para obtener datos de las APIs
  useEffect(() => {
    const fetchMinViewsResponse = async () => {
      try {
        const response = await api.get('helpers/obtener-respuesta-menor-vista');
        setMinViewsResponse(response.data);
      } catch (error) {
        console.error('Error fetching respuesta menor vista:', error);
      }
    };

    fetchMinViewsResponse();
  }, []);


  // useEffect para obtener datos de las APIs
  useEffect(() => {
    const fetchRespuestasMasViejaMasActual = async () => {
      try {
        const response = await api.get('helpers/obtener-respuestas-mas-vieja-mas-actual');
        setMasViejaMasActual(response.data);
      } catch (error) {
        console.error('Error fetching respuestas extremas:', error);
      }
    };
  
    fetchRespuestasMasViejaMasActual();
  }, []);


  // Datos y opciones para el gráfico
  const chartDataRespuestas = {
    labels: ['Respuestas Contestadas', 'Respuestas No Contestadas'],
    datasets: [
      {
        label: 'Respuestas',
        data: [data?.respuestas_contestadas || 0, data?.respuestas_no_contestadas || 0],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsRespuestas = {
    scales: { y: { type: 'linear', beginAtZero: true } },
  };



  // Datos y opciones para el gráfico
  const chartDataReputacion = {
    labels: ['Reputación Máxima'],
    datasets: [
      {
        label: 'Reputación Máxima',
        data: [maxReputation],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsReputacion = {
    scales: { y: { type: 'linear', beginAtZero: true } },
  };



  // Datos y opciones para el gráfico
  const chartDataMinViews = {
    labels: ['Respuesta con menor número de vistas'],
    datasets: [
      {
        label: 'Vistas',
        data: [minViewsResponse?.view_count || 0],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsMinViews = {
    scales: { y: { type: 'linear', beginAtZero: true } },
  };



  // Datos y opciones para el gráfico
  const chartDataRespuestasMasViejaMasActual = {
    labels: ['Respuesta más Vieja', 'Respuesta más Actual'],
    datasets: [
      {
        label: 'Respuestas Extremas',
        data: [
          new Date(respuestaMasViejaMasActual?.respuesta_mas_vieja?.creation_date) || 0,
          new Date(respuestaMasViejaMasActual?.respuesta_mas_actual?.creation_date) || 0,
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsRespuestasMasViejaMasActual = {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        display: false,
      },
      x: {
        type: 'category',
        labels: ['Respuesta más Vieja', 'Respuesta más Actual'],
      },
    },
  };


  return (
    <div>
      <h1>API Questions</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>¿Obtener el número de respuestas contestadas y no contestadas?</h2>
        {data && (
          <div>
            <p>Número de respuestas contestadas: {data.respuestas_contestadas}</p>
            <p>Número de respuestas no contestadas: {data.respuestas_no_contestadas}</p>
            <Bar data={chartDataRespuestas} options={chartOptionsRespuestas} />
          </div>
        )}
        <h2>¿Obtener la respuesta con mayor reputación?</h2>
        <p>{respuestaReputacion}</p>
        <div>
          <p>Reputación máxima: {maxReputation}</p>
          <Bar data={chartDataReputacion} options={chartOptionsReputacion} />
        </div>
        <h2>¿Obtener la respuesta con menor número de vistas?</h2>
        {minViewsResponse && (
          <div>
            <p>Vistas de la respuesta con menor número de vistas: {minViewsResponse.view_count}</p>
            <Bar data={chartDataMinViews} options={chartOptionsMinViews} />
          </div>
        )}
        <h2>¿Obtener la respuesta más vieja y más actual?</h2>
{respuestaMasViejaMasActual && (
  <div>
    <p>Respuesta más Vieja: {respuestaMasViejaMasActual.respuesta_mas_vieja.creation_date}</p>
    <p>Respuesta más Actual: {respuestaMasViejaMasActual.respuesta_mas_actual.creation_date}</p>
    <Bar data={chartDataRespuestasMasViejaMasActual} options={chartOptionsRespuestasMasViejaMasActual} />
  </div>
)}
      </div>
    </div>
  );
}

export default ApiQuestionsPage;
