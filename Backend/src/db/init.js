import db from '../config/db.js';

db.serialize(() => {


    // Users Table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


    //    API Requests 
    db.run(`
    CREATE TABLE IF NOT EXISTS api_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    body TEXT,
    collections_id INTEGER , 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

    //   Table for the API requests Headers 
    db.run(`
    CREATE TABLE IF NOT EXISTS api_request_headers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    header_key TEXT NOT NULL,
    header_value TEXT NOT NULL,
    FOREIGN KEY (request_id) REFERENCES api_requests(id) ON DELETE CASCADE
  )`);


    //   For Sending the requests 
    db.run(`
  CREATE TABLE IF NOT EXISTS api_request_executions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  status INTEGER,
  response_body TEXT,
  response_headers TEXT,
  duration INTEGER,
  error TEXT,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES api_requests(id) ON DELETE CASCADE
);`)

    //   for saving the collections 
    db.run(`
  CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`)




    // for the environment variable
    db.run(`
  CREATE TABLE IF NOT EXISTS environments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  variables TEXT NOT NULL, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`)


});

console.log('📦 Database initialized');
