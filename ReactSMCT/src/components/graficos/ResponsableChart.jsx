// En tu componente de React
import React, { useEffect, useRef } from 'react';
import {Chart} from 'chart.js/auto';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

const ResponsableChart = ({ responsable }) => {

    const chartRef = useRef(null);
    console.log(responsable);

  useEffect(() => {
    if (responsable) {
        // Si ya existe un gráfico, destrúyelo
        if (chartRef.current) {
          chartRef.current.destroy();
        }

      const ctx = document.getElementById('responsables-chart').getContext('2d');

      const responsables = Object.keys(responsable);
      const counts = Object.values(responsable);

       // Generar colores aleatorios para cada motivo
       const backgroundColors = responsables.map(() => getRandomColor());

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: responsables,
          datasets: [{
            data: counts,
            backgroundColor: backgroundColors,
          }],
        },
      });
    }
  }, [responsable]);

  return (
    <div>
      <canvas id="responsables-chart" width="400" height="400"></canvas>
    </div>
  );
};

export default ResponsableChart;
