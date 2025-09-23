// lib/oracle-db.js
import oracledb from "oracledb";

let isPoolInitialized = false;

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

async function initialize() {
  if (isPoolInitialized) {
    return;
  }

  try {
    await oracledb.createPool(dbConfig);
    isPoolInitialized = true;
    console.log("OracleDB connection pool started successfully.");
  } catch (err) {
    console.error("FATAL: Error starting OracleDB pool:", err);
    process.exit(1);
  }
}

export async function execute(statement, binds = [], opts = {}) {
  let connection;
  const finalOpts = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    ...opts,
  };

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(statement, binds, finalOpts);
    return { connection, result };
  } catch (err) {
    console.error("Database execution error:", err.message);
    throw err;
  } finally {
    if (connection) {
      try {
        if (opts.autoCommit !== false) {
          await connection.commit();
        }
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing Oracle connection:", closeErr);
      }
    }
  }
}

// --- THIS IS THE FIX ---
// Only try to start the Oracle pool if the environment is configured for it.
if (process.env.DATABASE_SOURCE === "oracle") {
  initialize();
}
