require('dotenv').config();
const mysql = require('mysql2/promise');

// Create the connection pool
const pool = mysql.createPool({
    host: 'db', // Use the Docker service name
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'sd2-db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false // Disable multiple statements for security
});

// Test the database connection
async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    } finally {
        if (connection) connection.release();
    }
}

// Utility function to query the database
async function query(sql, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Log the query for debugging
        console.log('Executing query:', sql, params);
        
        const [rows] = await connection.query(sql, params);
        
        // Log the result for debugging
        console.log('Query result:', rows);
        
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// Test the connection when the module loads
testConnection();

module.exports = {
    query,
    testConnection
};