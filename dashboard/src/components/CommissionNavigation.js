// src/components/CommissionNavigation.js
import React from 'react';

const CommissionNavigation = ({ filters, setFilters }) => {
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
        <label>Year:</label>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div>
        <label>Quarter:</label>
        <select name="quarter" value={filters.quarter} onChange={handleFilterChange}>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
      </div>
    </div>
  );
};

export default CommissionNavigation;
