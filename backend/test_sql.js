const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Function to find the maximum value in a specific column
function findMaxValueInCSV(filePath, column) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length === 0) {
          return reject('CSV file is empty');
        }
        const max = results.reduce((max, row) => {
          return Math.max(max, parseFloat(row[column]) || 0);
        }, -Infinity);
        resolve(max);
      })
      .on('error', reject);
  });
}

// Main function to handle the query
async function handleQuery(query) {
  if (isMaxValueQuery(query)) {
    const csvQuery = convertToCSVQuery(query);
    if (csvQuery) {
      const csvFilePath = path.join(__dirname, 'data', 'sales_data.csv');
      try {
        const maxValue = await findMaxValueInCSV(csvFilePath, csvQuery.column);
        return `The maximum value for ${csvQuery.column} is ${maxValue}`;
      } catch (error) {
        return `Error processing CSV: ${error}`;
      }
    } else {
      return 'No CSV conversion found for the query.';
    }
  } else {
    return 'Query is not related to maximum values.';
  }
}

// Example usage
handleQuery('What is the maximum sale amount?').then(console.log).catch(console.error);
