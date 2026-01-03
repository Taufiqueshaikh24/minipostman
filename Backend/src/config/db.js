import sqlite3 from 'sqlite3';
import { ENV } from './env.js';

const db = new sqlite3.Database(
  ENV.DB_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('❌ DB connection failed', err.message);
    } else {
      console.log('✅ SQLite connected');
    }
  }
);

db.exec('PRAGMA foreign_keys = ON');

export default db;
