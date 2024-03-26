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

const EquiposChart = ({ equipo }) => {
  const chartRef = useRef(null);
  console.log(equipo);

  useEffect(() => {
    if (equipo) {
      // Si ya existe un gráfico, destrúyelo
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById("equipos-chart").getContext("2d");

      const equipos = Object.keys(equipo);
      console.log("Veo etiqueta", equipos)
      const counts = Object.values(equipo);
      console.log("veo cantidades", counts)

      // Generar colores aleatorios para cada motivo
      const backgroundColors = equipos.map(() => getRandomColor());

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: equipos,
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
                text: 'Tareas No Cumplicas por Equipos',
              }
          }
        },
      });
    }
  }, [equipo]);

  return (
    <div>
      <canvas id="equipos-chart" width="400" height="400"></canvas>
    </div>
  );
};

export default EquiposChart;
