// db/schema.js
import pgClient from "./postgres";

// Create tables for the blog
async function createBlogTables() {
  try {
    // Create users table

    // Create categories table

    // Create posts table
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP
      )
    `);

    // Create tags table
    

    // Create post_tags junction table (many-to-many relationship)
    

    // Create comments table
  

    console.log("Blog tables created successfully");
  } catch (error) {
    console.error("Error creating blog tables:", error);
    throw error;
  }
}

export default createBlogTables;