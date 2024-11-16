import React from 'react';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';

const CustomChart = () => {
  const { chartType, xAxis, yAxis } = useParams();

  const data = {
    labels: xAxis.split(','),  // Assuming xAxis is a comma-separated string
    datasets: [
      {
        label: 'Sample Data',
        data: yAxis.split(',').map(Number),  // Assuming yAxis is a comma-separated string of numbers
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
        hiii
        
      {chartType === 'line' && <Line data={data} options={options} />}
      {chartType === 'bar' && <Bar data={data} options={options} />}
      {/* Add more chart types as needed */}
    </div>
  );
};

export default CustomChart;
