import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

import app from './firebase';


const db = getFirestore(app);
const storage = getStorage(app, 'gs://earnpaisa-a7d55.firebasestorage.app');

const uploadPostImage = async (uri, fileName) => {
  try {
    console.log('Uploading post image from URI:', uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `posts/${fileName}`);
    const metadata = { contentType: 'image/jpeg' };
    
    await uploadBytes(storageRef, blob, metadata);
    console.log('Post image uploaded:', fileName);
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading post image:', error);
    throw error;
  }
};

export const uploadPostImages = async (imageUris) => {
  try {
    const uploadPromises = imageUris.map((uri, index) => {
      const fileName = `post_${Date.now()}_${index}.jpg`;
      return uploadPostImage(uri, fileName);
    });
    
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading post images:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    if (!postData.images || postData.images.length === 0) {
      throw new Error('At least one image is required for a post');
    }
    
    const imageUrls = await uploadPostImages(postData.images);
    
    const newPost = {
      userId: postData.userId,
      username: postData.username,
      userAvatar: postData.userAvatar,
      description: postData.description,
      images: imageUrls,
      likes: 0,
      likedBy: [],
      createdAt: Timestamp.now(),
      timestamp: new Date().toISOString()
    };
    
    const newPostRef = doc(collection(db, 'posts'));
    await setDoc(newPostRef, newPost);
    
    console.log('Post created successfully with ID:', newPostRef.id);
    
    return {
      id: newPostRef.id,
      ...newPost
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchAllPosts = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'), 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    return {
      id: postDoc.id,
      ...postDoc.data()
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const updatedData = {
      description: postData.description || postDoc.data().description,
      updatedAt: Timestamp.now()
    };
    
    await setDoc(postRef, updatedData, { merge: true });
    console.log('Post updated successfully:', postId);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};


export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    console.log('Post deleted successfully:', postId);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const togglePostLike = async (postId, userId, liked) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    const likedBy = postData.likedBy || [];
    
    if (liked) {
      if (!likedBy.includes(userId)) {
        await setDoc(postRef, {
          likes: (postData.likes || 0) + 1,
          likedBy: [...likedBy, userId]
        }, { merge: true });
      }
    } else {
      if (likedBy.includes(userId)) {
        await setDoc(postRef, {
          likes: Math.max(0, (postData.likes || 0) - 1),
          likedBy: likedBy.filter(id => id !== userId)
        }, { merge: true });
      }
    }
    
    console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'} by user ${userId}`);
  } catch (error) {
    console.error('Error toggling post like:', error);
    throw error;
  }
};

export const getPostLikeStatus = async (postId, userId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const likedBy = postDoc.data().likedBy || [];
    return likedBy.includes(userId);
  } catch (error) {
    console.error('Error getting post like status:', error);
    throw error;
  }
};