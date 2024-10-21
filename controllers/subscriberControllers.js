import firebase from '../helpers/firebase.js';
import Subscriber from '../models/Subscriber.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { sendEmailConfirmation } from '../helpers/utils/emailService.js';

const db = getFirestore(firebase);

// HELPER FUNCTION TO CHECK IF SUBSCRIBER ALREADY EXISTS
export const subscriberExists = async (email) => {
    try {
        const subscribers = await getDocs(query(collection(db, 'subscribers'), where('email', '==', email)));
        const subscriberArray = [];

        if (subscribers.empty) return [];
        else {
            subscribers.forEach(async (doc) => {
                const subscriber = new Subscriber(
                    doc.id,
                    doc.data().email,
                    doc.data().uuid,
                    doc.data().confirmed_at,
                );
                subscriberArray.push(subscriber);
            });

            return subscriberArray;
        }
 
    } catch (error) {
        console.log(error.message);
    }
};

export const createSubscriber = async (req, res, next) => {
    try {
        const data = req.body;
        const subscriber = await subscriberExists(data.email);
        
        if (subscriber.length <= 0) {
            const newSubscriber = {
                'email': data.email,
                'uuid': uuidv4(),
                'confirmed_at': null,
            }
            await addDoc(collection(db, 'subscribers'), newSubscriber);

            await sendEmailConfirmation(newSubscriber.email, 'Bevestiging nieuwsbrief inschrijving.', newSubscriber.uuid);
            res.status(201).send(newSubscriber);
            return;
        }

        if (subscriber[0].confirmed_at === null) {

            await sendEmailConfirmation(subscriber[0].email, 'Bevestiging nieuwsbrief inschrijving.', subscriber[0].uuid);
            res.status(201).send(subscriber[0]);
            return;
        }

        res.status(409).send('This email is already subscribed!');
        return;
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};