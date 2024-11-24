import { parse } from 'papaparse';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebaseConfig'; 

const db = getFirestore(app);

export const downloadCsv = (file: File) => {
    
}