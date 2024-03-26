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

const MotivosChart = ({ motivo }) => {

    const chartRef = useRef(null);
    console.log(motivo);

  useEffect(() => {
    if (motivo) {
        // Si ya existe un gráfico, destrúyelo
        if (chartRef.current) {
          chartRef.current.destroy();
        }

      const ctx = document.getElementById('motivos-chart').getContext('2d');

      const motivos = Object.keys(motivo);
      const counts = Object.values(motivo);

       // Generar colores aleatorios para cada motivo
       const backgroundColors = motivos.map(() => getRandomColor());

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: motivos,
          datasets: [{
            data: counts,
            backgroundColor: backgroundColors,
          }],
        },
        options: {
          responsive: true,
        }
      });
    }
  }, [motivo]);

  return (
    <div>
      <canvas id="motivos-chart" width="400" height="400"></canvas>
    </div>
  );
};

export default MotivosChart;
