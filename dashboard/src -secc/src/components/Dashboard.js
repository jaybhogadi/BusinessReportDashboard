// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = ({ apiEndpoint, title }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/${apiEndpoint}`)
//       .then(response => {
//         setData(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the data!', error);
//       });
//   }, [apiEndpoint]);

//   return (
//     <div>

//       <h1>{title}</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default Dashboard;
// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ apiEndpoint, title, renderCharts }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:5000/api/${apiEndpoint}`)
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [apiEndpoint]);

  return (
    <div>
      {/* <h1>{title}</h1> */}
      {isLoading && <p>Loading...</p>}
      {/* {error && <p>Error: {error}</p>} */}
      {/* {!isLoading && !error && renderCharts(data)} */}
    </div>
  );
};

export default Dashboard;
