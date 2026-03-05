import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'users.db');
let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    
    // Criar tabela se não existir
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  return db;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

export function saveUser(name: string, email: string): User {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(name, email);
  
  return {
    id: result.lastInsertRowid as number,
    name,
    email,
    created_at: new Date().toISOString()
  };
}

export function getAllUsers(): User[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
  return stmt.all() as User[];
}
