// const initSqlJs = require('sql.js');


// async function runSql() {
//   const SQL = await initSqlJs();
//   const db = new SQL.Database();

//   db.run("CREATE TABLE test (id INT, name TEXT)");
//   db.run("INSERT INTO test (id, name) VALUES (?, ?)", [1, 'John']);

//   const result = db.exec("SELECT * FROM test");
//   console.log(result[0].values); // Outputs: [[1, 'John']]
// }

// runSql();
// Import alasql
const alasql = require('alasql');

function runSql() {
  // Create a table and insert data
  alasql('CREATE TABLE test (id INT, name STRING)');
  alasql('INSERT INTO test (id, name) VALUES (1, "John")');

  // Execute a query
  const result = alasql('SELECT * FROM test');
  console.log(result); // Outputs: [{ id: 1, name: 'John' }]
}

runSql();
