// En tu componente de React
import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EquiposChart = ({ tarea }) => {
  const chartRef = useRef(null);
  console.log(tarea);

  useEffect(() => {
    if (tarea) {
      // Si ya existe un gráfico, destrúyelo
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById("tareas-chart").getContext("2d");

      const tareas = Object.keys(tarea);
      console.log("Veo etiqueta", tareas)
      const counts = Object.values(tarea);
      console.log("veo cantidades", counts)

      // Generar colores aleatorios para cada motivo
      const backgroundColors = tareas.map(() => getRandomColor());

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: tareas,
          datasets: [
            {
              data: counts,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          responsive: true,  
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
                position: 'top',
                display: false,
              },
              title: {
                display: true,
                text: 'Tareas No Cumplicas',
              }
          }
        },
      });
    }
  }, [tarea]);

  return (
    <div>
      <canvas id="tareas-chart" width="400" height="400"></canvas>
    </div>
  );
};

export default EquiposChart;
