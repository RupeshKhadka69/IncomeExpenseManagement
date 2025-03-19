import {Request,Response} from "express"
import pgClient from "../db/postgres"; 


export const createPost = async (req:Request,res:Response) => {
  
  try {
    const { title, content } = req.body;
    const result = await pgClient.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};
export const uploadImage = async(req:Request,res:Response) => {
    try {
        if(!req.file) {
            console.log("no file provided");
            return;
        }
        // Return the URL to the uploaded image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
      }
    }


export const getPostById = async (req:Request,res:Response) => {
    try {
        const { id } = req.params;
        const result = await pgClient.query('SELECT * FROM posts WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
      }
};

export const getPostBySlug = async (slug:string) => {
  const query = `
    SELECT p.*
    FROM posts p
    WHERE p.slug = $1
  `;
  
  const result = await pgClient.query(query, [slug]);
  return result.rows[0];
};

export const getAllPosts = async (req:Request,res:Response) => {
    try {
        const result = await pgClient.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
      }
};

export const updatePost = async (id:string, postData:any) => {
  const { title, slug, content, featured_image, excerpt, status } = postData;
  
  let query = `UPDATE posts SET `;
  const updates = [];
  const values = [];
  let paramIndex = 1;
  
  if (title !== undefined) {
    updates.push(`title = $${paramIndex}`);
    values.push(title);
    paramIndex++;
  }
  
  if (slug !== undefined) {
    updates.push(`slug = $${paramIndex}`);
    values.push(slug);
    paramIndex++;
  }
  
  if (content !== undefined) {
    updates.push(`content = $${paramIndex}`);
    values.push(content);
    paramIndex++;
  }
  
  if (featured_image !== undefined) {
    updates.push(`featured_image = $${paramIndex}`);
    values.push(featured_image);
    paramIndex++;
  }
  
  if (excerpt !== undefined) {
    updates.push(`excerpt = $${paramIndex}`);
    values.push(excerpt);
    paramIndex++;
  }
  
  if (status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
    
    // Update published_at if status is changing to published
    if (status === 'published') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }
  }
  
 
  
  // Always update the updated_at timestamp
  updates.push(`updated_at = NOW()`);
  
  query += updates.join(', ');
  query += ` WHERE id = $${paramIndex} RETURNING *`;
  values.push(id);
  
  const result = await pgClient.query(query, values);
  return result.rows[0];
};




