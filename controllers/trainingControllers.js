import firebase from '../helpers/firebase.js';
import Training from '../models/Training.js';

import { sortByDays } from '../helpers/utils/sortByDays.js';

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    query,
    where
} from 'firebase/firestore';

const db = getFirestore(firebase);

export const getTrainings = async (req, res, next) => {
    try {
        
        const trainings = await getDocs(collection(db, 'trainings'));
        
        const trainingArray = [];

        if (trainings.empty) {
            res.status(404).send('No Trainings found');
        } else {
            trainings.forEach(async (doc) => {
            const training = new Training(
                doc.id,
                doc.data().season,
                doc.data().day,
                doc.data().hours,
                doc.data().details,
            );
            trainingArray.push(training);
        });

            const filteredWinter = trainingArray.filter(training => training.season === 'winter');
            const filteredSummer = trainingArray.filter(training => training.season === 'zomer');

            res.status(200).json({ 'winter': sortByDays(filteredWinter), 'summer': sortByDays(filteredSummer) });
        }
    } catch (error) {
      res.status(400).send(error.message);
    }
};

export const createTraining = async (req, res, next) => {
    try {
        const data = req.body;
        let trainings = await getDocs(query(collection(db, 'trainings'), where('day', '==', data.day), where('season', '==', data.season)));
        
        if (trainings.empty) {
            await addDoc(collection(db, 'trainings'), data);
            res.status(201).json(data);
        } else {
            res.status(409).send('Training already exists in given season!')
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
};