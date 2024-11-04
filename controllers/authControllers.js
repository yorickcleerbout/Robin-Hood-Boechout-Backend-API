import firebaseAdmin from '../helpers/firebaseAdmin.js';
import firebase from '../helpers/firebase.js';
import AccessRequest from '../models/AccessRequest.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore(firebase);

// HELPER FUNCTION TO CHECK IF ACCESS-REQUEST ALREADY EXISTS
export const accessRequestExists = async (email) => {
    try {
        const requests = await getDocs(query(collection(db, 'access_requests'), where('email', '==', email)));
        const requestsArray = [];

        if (requests.empty) return [];
        else {
            requests.forEach(async (doc) => {
                const request = new AccessRequest(
                    doc.id,
                    doc.data().email,
                    doc.data().requested_at,
                    doc.data().granted_at,
                    doc.data().revoked_at,
                );
                requestsArray.push(request);
            });

            return requestsArray;
        }
 
    } catch (error) {
        console.log(error.message);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, req.body.data.email, req.body.data.password);
        const token = await userCredentials.user.getIdToken();
        
        res.status(200).json({token});
    } catch (error) {
        if (error.code === 'auth/invalid-credential') return res.status(401).send('auth/invalid-credential');
        res.status(400).send(error.message);
    }
};

export const requestAccess = async (req, res, next) => {
    try {
        const accessRequests = await accessRequestExists(req.body.data.email);
        
        // FIRST TIME REQUESTING ACCESS
        if (accessRequests.length <= 0) {
            const newAccessRequest = {
                'email': req.body.data.email,
                'requested_at': new Date().toLocaleDateString('en-GB'),
                'granted_at': null,
                'revoked_at': null,
            }
            await addDoc(collection(db, 'access_requests'), newAccessRequest);

            res.status(201).send(newAccessRequest);
            return;
        }

        // PREVIOUS ACCESS HAS BEEN REVOKED
        if (accessRequests[0].revoked_at !== null) {
            const newAccessRequest = {
                'email': req.body.data.email,
                'requested_at': new Date().toLocaleDateString('en-GB'),
                'granted_at': null,
                'revoked_at': null,
            }
            await addDoc(collection(db, 'access_requests'), newAccessRequest);

            res.status(201).send(newAccessRequest);
            return;
        }

        res.status(409).send('Access has already been requested for this email.');
        return;
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, req.body.data.email, req.body.data.password);
        
        await updateProfile(userCredentials.user, {
            displayName: `${req.body.firstname} ${req.body.lastname.charAt(0)}.`,
        });

        await firebaseAdmin.auth().setCustomUserClaims(userCredentials.user.uid, { 'roles': [req.body.data.role]});
        
        res.status(201).json({
            message: 'New user created successfully!',
            user: {
                email: userCredentials.user.email,
                displayName: userCredentials.user.displayName,
                role: req.body.data.role
            },
        });
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') res.status(409).send('auth/email-already-in-use');
        if (error.code === 'auth/missing-email') res.status(400).send('auth/missing-email');
        if (error.code === 'auth/missing-password') res.status(400).send('auth/missing-password');
        res.status(400).send(error);
    }
};

// HELPER FUNCTION FOR VALIDATION ID-TOKEN
export const verifyIdToken = async (token) => {
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        const user = await firebaseAdmin.auth().getUser(decodedToken.user_id);

        return { status: 200, details: decodedToken, user: user}
    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            return { status: 401, details: 'Token Expired' }
        } else if (error.code === 'auth/invalid-id-token') {
            return { status: 401, details: 'Invalid Token' }
        } else {
            return { status: 500, details: 'Internal Server Error' }
        }
    }
};

export const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(400).send("Missing Authorization");

    const { status, details, user } = await verifyIdToken(req.headers.authorization.split(' ')[1]);
    
    res.user = user;
    res.status(status).send(details);
    next();
};