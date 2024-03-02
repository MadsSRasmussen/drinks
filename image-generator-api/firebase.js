import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes
} from "firebase/storage"

const firebaseConfig = {    
  apiKey: "AIzaSyBCqRUVPx-eLAyLeb-5duJJBmqxrzNME4o",
  authDomain: "drinks-fbc53.firebaseapp.com",
  projectId: "drinks-fbc53",
  storageBucket: "drinks-fbc53.appspot.com",
  messagingSenderId: "1040541651600",
  appId: "1:1040541651600:web:7518866543cfd5551dbe15",
  measurementId: "G-HP17V33S1T"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const testRef = ref(storage, 'test/image01');

// Fetches all cards corresponding to game id:
export function getCardsForGame(gid) {

    return new Promise(async (resolve, reject) => {
        
        try {
            
            const q = query(collection(db, "cards"), where("game", "==", gid));

            const querySnapshot = await getDocs(q);

            const docs = [];
            querySnapshot.forEach((doc) => {
                const docObject = doc.data();
                docObject.id = doc.id;
                docs.push(docObject);
            })

            resolve(docs);

        } catch (error) {
            reject(error);
        }

    })

}

// Fetches a card from the db:
export function getCard(cid) {
    return new Promise((resolve, reject) => {
        const docRef = doc(db, "cards", cid);
        getDoc(docRef)
        .then((card) => {
            const cardObject = card.data();
            cardObject.id = card.id
            resolve(cardObject);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        })
    })

}

// Creates a job in the jobs-collection
export function createJob(type, status) {

    return new Promise((resolve, reject) => {
        
        addDoc(collection(db, "jobs"), {
            type: type,
            status: status,
            timestamp: serverTimestamp()
        })
        .then((docRef) => {
            resolve(docRef);
        })
        .catch((error) => {
            reject(error);
        })

    })

}

// Updates a game
export function updateGame(gid, updates) {

    return new Promise((resolve, reject) => {
        
        const docRef = doc(db, "games", gid);

        updateDoc(docRef, updates)
        .then((docSnap) => {
            resolve(docSnap);
        })
        .catch((error) => {
            reject(error);
        })

    })

}

// Updates a card
export function updateCard(cid, updates) {

    return new Promise((resolve, reject) => {
        const docRef = doc(db, "cards", cid);
        updateDoc(docRef, updates)
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        })
    })

}

// Updates a job
export function updateJob(jid, updates) {

    return new Promise((resolve, reject) => {
            
        const docRef = doc(db, "jobs", jid);
        
            updateDoc(docRef, updates)
            .then((docSnap) => {
                resolve(docSnap);
            })
            .catch((error) => {
                reject(error);
            })
            
    })

}

// Uploads a blob to a specified path with a specified filename...
export function uploadBlob(file, path, filename) {

    return new Promise((resolve, reject) => {
        
        try {
            
            const metadata = {
                contentType: 'image/webp',
              }

            const storageRef = ref(storage, path + "/" + filename);

            uploadBytes(storageRef, file, metadata)
            .then((snapshot) => {

                // Update image-field for game

                resolve(snapshot);
            })

        } catch (error) {
            reject(error);
        }

    })

}

// Gets a users auth status...
export function getUserAuthStatus(uid) {

    return new Promise(async (resolve, reject) => {
        
        try {
            
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                resolve(docSnap.data().auth);
            } else {
                reject("Document not found");
            }
            
        } catch (error) {
            reject(error);
        }

    })

}
