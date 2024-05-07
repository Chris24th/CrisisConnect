// api/thumbs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { openDB } from './db';

export async function createThumb(req: NextApiRequest, res: NextApiResponse) {
  const { comment_id, value } = req.body;
  const db = await openDB;
  
  // Check if a record exists for the given comment_id and value
  const existingThumb = await db.get(
    'SELECT * FROM thumbs WHERE comment_id = ? AND value = ?',
    comment_id,
    value
  );

  if (existingThumb) {
    // If a record exists, increment the value
    await db.run(
      'UPDATE thumbs SET value = value + ? WHERE id = ?',
      value,
      existingThumb.id
    );
    res.status(200).json({ success: true });
  } else {
    // If no record exists, insert a new one
    const result = await db.run(
      'INSERT INTO thumbs (comment_id, value) VALUES (?, ?)',
      comment_id,
      value
    );
    res.status(201).json({ id: result.lastID });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // If the request method is POST, call the createThumb function
    createThumb(req, res);
  } else {
    // If the request method is not POST, respond with "Method Not Allowed"
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
