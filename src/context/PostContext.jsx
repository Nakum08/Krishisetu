import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllPosts } from '../services/firestoreSeedPosts';

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await fetchAllPosts();
      setPosts(postsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addPost = (newPost) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  const updatePost = (updatedPost) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const deletePost = (postId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== postId)
    );
  };

  const toggleLike = (postId, userId, liked) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const likedBy = [...(post.likedBy || [])];
          
          if (liked) {
            if (!likedBy.includes(userId)) {
              likedBy.push(userId);
            }
          } else {
            const index = likedBy.indexOf(userId);
            if (index !== -1) {
              likedBy.splice(index, 1);
            }
          }
          
          return {
            ...post,
            likes: liked 
              ? (post.likes || 0) + 1 
              : Math.max(0, (post.likes || 0) - 1),
            likedBy
          };
        }
        return post;
      })
    );
  };

  const value = {
    posts,
    loading,
    error,
    loadPosts,
    addPost,
    updatePost,
    deletePost,
    toggleLike
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;