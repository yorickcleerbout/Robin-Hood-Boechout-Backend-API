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

        res.cookie('authToken', token, {
            httpOnly: true,  // Prevent JavaScript access
            secure: true,    // Ensures the cookie is sent only over HTTPS
            sameSite: 'Strict',  // Prevents cross-site request forgery (CSRF)
            maxAge: 60 * 60 * 1000,  // 1 hour expiration
        });
        res.status(200).send('Login successfull');
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