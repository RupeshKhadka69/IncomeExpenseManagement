import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/blog/get-all-post');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Create your first blog post!</p>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <Link to={`/blog/single/${post.id}`}>Read more</Link>
            </div>
          ))}
        </div>
      )}
      <Link to="/blog/add-blog" className="create-button">Create New Post</Link>
    </div>
  );
};

export default BlogList;