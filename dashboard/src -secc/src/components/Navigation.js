// src/components/Navigation.js
import React from 'react';

const Navigation = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="navigation">
      <div>
        <label>Quarter:</label>
        <select name="quarter" value={filters.quarter} onChange={handleFilterChange}>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
      </div>

      <div>
        <label>Month:</label>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>

      <div>
        <label>Year:</label>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div>
        <label>Region:</label>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="North">North</option>
          <option value="East">East</option>
          <option value="South">South</option>
          <option value="West">West</option>
        </select>
      </div>
    </div>
  );
};

export default Navigation;
