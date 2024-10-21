import firebaseAdmin from '../helpers/firebaseAdmin.js';

import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

const auth = getAuth();

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