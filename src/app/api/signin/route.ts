import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const [rows] = await connection.execute(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  await connection.end();

  if ((rows as any[]).length === 0) {
    return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
  }

  // Return username as well
  const user = (rows as any[])[0];
  return NextResponse.json({ message: 'Sign in successful.', username: user.username }, { status: 200 });
} 