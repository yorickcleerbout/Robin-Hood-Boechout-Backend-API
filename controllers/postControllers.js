import firebase from '../helpers/firebase.js';
import Post from '../models/Post.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';

const db = getFirestore(firebase);

export const getPosts = async (req, res, next) => {
    try {
        if (req.query.featured === 'true') {
            var posts = await getDocs(query(collection(db, 'posts'), where('featured', '==', true))); 
        } else {
            var posts = await getDocs(collection(db, 'posts'));
        }
        
        const postArray = [];

        if (posts.empty) {
        res.status(404).send('No Posts found');
        } else {
        posts.forEach(async (doc) => {
            const post = new Post(
                doc.id,
                doc.data().slug,
                doc.data().post_details,
                doc.data().tag,
                doc.data().created_at,
                doc.data().published_at,
                doc.data().author,
                doc.data().featured,
            );
            postArray.push(post);
        });

        postArray.sort((a, b) => {
            const dateA = new Date(a.created_at.split("/").reverse().join("-"));
            const dateB = new Date(b.created_at.split("/").reverse().join("-"));
            return dateB - dateA; // Ascending order
        });

        res.status(200).json(postArray);
        }
    } catch (error) {
      res.status(400).send(error.message);
    }
};

export const getPostBySlug = async (req, res, next) => {
    try {
        const posts = await getDocs(query(collection(db, 'posts'), where('slug', '==', req.params.slug))); 
        const postArray = [];

        if (posts.empty) {
        res.status(404).send('No Posts found');
        } else {
        posts.forEach(async (doc) => {
            const post = new Post(
                doc.id,
                doc.data().slug,
                doc.data().post_details,
                doc.data().tag,
                doc.data().created_at,
                doc.data().published_at,
                doc.data().author,
                doc.data().featured,
            );
            postArray.push(post);
        });

        res.status(200).json(postArray);
        }
    } catch (error) {
      res.status(400).send(error.message);
    }
};

export const createPost = async (req, res, next) => {
    try {
        const data = req.body;
        let posts = await getDocs(query(collection(db, 'posts'), where('slug', '==', data.slug)));
        
        if (posts.empty) {
            await addDoc(collection(db, 'posts'), data);
            res.status(201).json(data);
        } else {
            res.status(409).send('Post already exists!')
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const deletePostById = async (req, res, next) => {
    try {
        let posts = await getDocs(query(collection(db, 'posts'), where('__name__', '==', req.params.id)));
        
        if (posts.empty) {
            res.status(404).send(`No post found with id '${req.params.id}'.`);
        } else {
            await deleteDoc(doc(db, 'posts', req.params.id));
            res.status(200).send(`Post with id '${req.params.id}' successfully deleted.`);
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};