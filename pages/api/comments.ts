// api/comments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { openDB, createTables } from './db';

// Initialize the database tables
createTables();

// Interface for comment data with thumbs count
interface CommentWithThumbs {
  id: number;
  text: string;
  created_at: string;
  thumbsUp: number;
  thumbsDown: number;
}

// GET /api/comments
export async function getComments(_req: NextApiRequest, res: NextApiResponse<CommentWithThumbs[]>) {
  try {
    const db = await openDB;
    const comments: CommentWithThumbs[] = await db.all(`
      SELECT
        c.id,
        c.text,
        c.created_at,
        (SELECT COUNT(*) FROM thumbs t WHERE t.comment_id = c.id AND t.value = 1) AS thumbsUp,
        (SELECT COUNT(*) FROM thumbs t WHERE t.comment_id = c.id AND t.value = -1) AS thumbsDown
      FROM comments c
    `);
    res.status(200).json(comments);
  } catch (error) {
  }
}

// POST /api/comments
export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text } = req.body;
    const db = await openDB;
    const result = await db.run('INSERT INTO comments (text) VALUES (?)', text);
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT /api/comments
export async function updateComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, text } = req.body;
    const db = await openDB;
    await db.run(`
    UPDATE comments
    SET 
        text = ?
    WHERE id = ?
  `, text, id);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /api/comments
export async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    const db = await openDB;
    await db.run('DELETE FROM comments WHERE id = ?', id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Default handler for API requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getComments(req, res);
    case 'POST':
      return createComment(req, res);
    case 'PUT':
      return updateComment(req, res);
    case 'DELETE':
      return deleteComment(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
