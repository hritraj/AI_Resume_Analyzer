import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  console.log('signup route called');
  const { username, email, password } = await req.json();

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  console.log('connected to mysql');

  // Check if user exists
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  console.log('checked if user exists');
  if ((rows as any[]).length > 0) {
    await connection.end();
    return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
  }

  // Insert new user with username
  await connection.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  await connection.end();
  return NextResponse.json({ message: 'User registered successfully.' }, { status: 200 });
} 