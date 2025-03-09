import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useState, useEffect } from "react";
import styles from '../../public/styles/page.module.scss';

Chart.register(...registerables);

const CovidChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        let dias = Array.from({ length: 20 }, (_, i) => `Dia ${i + 1}`);
        let brasil = [];
        let eua = [];
        let india = [];
        let russia = [];
        let reinoUnido = [];

        let interval = setInterval(() => {
            if (brasil.length < 20) {
                brasil.push((brasil[brasil.length - 1] || 10000) + Math.floor(Math.random() * 5000));
                eua.push((eua[eua.length - 1] || 50000) + Math.floor(Math.random() * 10000));
                india.push((india[india.length - 1] || 30000) + Math.floor(Math.random() * 8000));
                russia.push((russia[russia.length - 1] || 15000) + Math.floor(Math.random() * 5000));
                reinoUnido.push((reinoUnido[reinoUnido.length - 1] || 12000) + Math.floor(Math.random() * 3000));

                setChartData({
                    labels: dias.slice(0, brasil.length),
                    datasets: [
                        {
                            label: "Brasil 🇧🇷",
                            data: brasil,
                            borderColor: "green",
                            backgroundColor: "rgba(0, 128, 0, 0.2)",
                            fill: true,
                        },
                        {
                            label: "EUA 🇺🇸",
                            data: eua,
                            borderColor: "blue",
                            backgroundColor: "rgba(0, 0, 255, 0.2)",
                            fill: true,
                        },
                        {
                            label: "Índia 🇮🇳",
                            data: india,
                            borderColor: "orange",
                            backgroundColor: "rgba(255, 165, 0, 0.2)",
                            fill: true,
                        },
                        {
                            label: "Rússia 🇷🇺",
                            data: russia,
                            borderColor: "red",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            fill: true,
                        },
                        {
                            label: "Reino Unido 🇬🇧",
                            data: reinoUnido,
                            borderColor: "purple",
                            backgroundColor: "rgba(196, 20, 196, 0.2)",
                            fill: true,
                        },
                    ],
                });
            } else {
                clearInterval(interval);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.line}> {/* Use styles.line */}
      <h2 style={{ textAlign: "center", color: "darkblue" }}>📈 Evolução dos Casos de COVID-19</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          animation: { duration: 10000 }
        }}
      />
    </div>
    );
};

export default CovidChart;
