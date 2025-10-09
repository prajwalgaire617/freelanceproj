const mysql = require('mysql2/promise');
const config = require('../src/db/config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port || 3306,
      user: dbConfig.username,
      password: dbConfig.password
    });

    console.log('🔌 Connected to MySQL server');

    // Create databases
    const databases = [dbConfig.database];
    if (env === 'development') {
      databases.push(`${dbConfig.database}_test`);
    }

    for (const dbName of databases) {
      try {
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created or already exists`);
      } catch (error) {
        console.error(`❌ Error creating database '${dbName}':`, error.message);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;