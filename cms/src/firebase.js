import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCqRUVPx-eLAyLeb-5duJJBmqxrzNME4o",
  authDomain: "drinks-fbc53.firebaseapp.com",
  projectId: "drinks-fbc53",
  storageBucket: "drinks-fbc53.appspot.com",
  messagingSenderId: "1040541651600",
  appId: "1:1040541651600:web:d1f2e4d9df9657fe1dbe15",
  measurementId: "G-MPTWWPBR8N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage();

// Retrieves a single game in 'games' collection
export function getGame(gid) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "games", gid);

      getDoc(docRef)
        .then((snapshot) => {
          const gameObject = snapshot.data();
          gameObject.id = snapshot.id;

          resolve(gameObject);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Returns downloadURL for image
export function getImageDownloadURL(path) {
  return new Promise((resolve, reject) => {
    getDownloadURL(ref(storage, path))
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Fetches all files in directory given with path
export function listAllFiles(path) {
  return new Promise((resolve, reject) => {
    const listRef = ref(storage, path);

    listAll(listRef)
      .then((res) => {
        const locations = [];

        res.items.forEach((item) => {
          locations.push(item._location.path);
        });
        resolve(locations);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Retrievs games in 'games' collection in batches of 5
export function getGames(lastDoc = null) {
  return new Promise((resolve, reject) => {
    try {
      let q;

      if (lastDoc) {
        q = query(
          collection(db, "games"),
          orderBy("timestamp", "desc"),
          startAfter(lastDoc),
          limit(5),
        );
      } else {
        q = query(
          collection(db, "games"),
          orderBy("timestamp", "desc"),
          limit(5),
        );
      }

      getDocs(q)
        .then((snapshot) => {
          const data = [];

          snapshot.forEach((game) => {
            const gameObject = game.data();
            gameObject.id = game.id;

            data.push(gameObject);
          });

          const lastViewed = snapshot.docs[snapshot.docs.length - 1];

          resolve([data, lastViewed]);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Updates a game:
export function updateGame(gid, updates) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "games", gid);

      updateDoc(docRef, updates)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Function that creates an empty game and returns the docRef...
// Timestamp - and user who created the game...
export function createEmptyGame() {
  return new Promise((resolve, reject) => {
    try {
      getUserId()
        .then((uid) => {
          addDoc(collection(db, "games"), {
            name: "",
            category: "",
            status: "stable",
            image: "",
            user: uid,
            timestamp: serverTimestamp(),
          })
            .then((docRef) => {
              resolve(docRef);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to delete game AND delete all cards assosiated with this game...
export function deleteGame(gid) {
  return new Promise((resolve, reject) => {
    try {
      const q = query(collection(db, "cards"), where("game", "==", gid));

      getDocs(q).then((data) => {
        const deletePromises = [];

        data.forEach((doc) => {
          deletePromises.push(deleteCard(doc.id));
        });

        Promise.all(deletePromises).then((values) => {
          values.forEach((value) => {
            console.log("Deleted ", value);
          });

          const gameDocRef = doc(db, "games", gid);

          deleteDoc(gameDocRef)
            .then(() => {
              resolve(
                "Successfully deleted game: ",
                gid,
                " and ",
                values.length,
                " cards.",
              );
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Creates a card in cards collection:
export function createCard(card) {
  return new Promise((resolve, reject) => {
    try {
      addDoc(collection(db, "cards"), {
        title: card.title,
        content: card.content,
        image: card.image ? card.image : "",
        index: card.index,
        game: card.game,
      })
        .then((docRef) => {
          resolve(docRef);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Sets a card with a card-id:
export function updateCard(cid, updates) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "cards", cid);
      updateDoc(docRef, updates)
        .then((result) => {
          resolve("Successfully updated card: " + cid);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Deletes a card:
export function deleteCard(cid) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "cards", cid);

      // First we fetch the document to get the game-id - we need this to reorder the rest of the cards related to that id...
      getDoc(docRef).then((doc) => {
        const gameId = doc.data().game;

        deleteDoc(docRef)
          .then((value) => {
            //Reorder other cards in collection with the same game-id...
            reorderCardsForGame(gameId)
              .then((succesString) => {
                console.log(succesString);
                resolve(value);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (error) {
      reject(error);
    }
  });
}

// When a card is deleted, it is required to reorder the remaining cards in the database and assign new index-values...
export function reorderCardsForGame(gid) {
  return new Promise((resolve, reject) => {
    try {
      const q = query(collection(db, "cards"), where("game", "==", gid));

      getDocs(q)
        .then((data) => {
          const docs = [];

          data.forEach((doc) => {
            const docObject = doc.data();
            docObject.id = doc.id;

            docs.push(docObject);
          });

          console.log(docs);
          docs.sort((a, b) => a.index - b.index);
          console.log("Sorted Data", docs);

          const updatePromises = [];

          docs.forEach((card, index) => {
            updatePromises.push(
              updateCard(card.id, {
                index: index,
              }),
            );
          });

          Promise.all(updatePromises).then((values) => {
            values.forEach((value) => {
              console.log(value);
            });
            resolve(
              "Succesfully updated the index of " + data.length + " documents.",
            );
          });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Retrieves all cards that has the gid as game-id...
export function getCardsForGame(gid) {
  return new Promise((resolve, reject) => {
    try {
      const q = query(collection(db, "cards"), where("game", "==", gid));

      getDocs(q).then((snapshot) => {
        const data = [];

        snapshot.forEach((card) => {
          const cardObject = card.data();
          cardObject.id = card.id;

          data.push(cardObject);
        });

        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// A structure containing user-related-functions
const Users = {};

Users.currentUser = {};

// Creates a user and adds a ref to this user in the users-collection of the database...
Users.createUser = function (name, email, password) {
  return new Promise((resolve, reject) => {
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((data) => {
          const uid = data.user.uid;
          // Writes a document in the users-collection with the same id as the user, the uid
          setDoc(doc(db, "users", uid), {
            name: name,
            email: email,
            auth: "default",
            timestamp: serverTimestamp(),
          }).then(() => {
            console.log("Successfully added the user: ", uid);
            resolve(uid);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Sign in with user - return uid...
Users.singIn = function (email, password) {
  return new Promise((resolve, reject) => {
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          resolve(user.uid);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// Signs user out...
Users.signOut = function () {
  return new Promise((resolve, reject) => {
    try {
      signOut(auth).then(resolve());
    } catch (error) {
      reject(error);
    }
  });
};

// Get the authentication-status of user...
Users.getAuthStatus = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const uid = await getUserId();
      const docRef = doc(db, "users", uid);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap) {
            Users.currentUser.name = docSnap.data().name;
            resolve(docSnap.data().auth);
          } else {
            reject(new Error("Document not found..."));
          }
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// It is required to get the user from onAuthStateChanged to enable page reload to restricted page - function is used in the funtion above...
function getUserId() {
  return new Promise((resolve, reject) => {
    try {
      const removeListener = onAuthStateChanged(auth, (user) => {
        try {
          if (user) {
            resolve(user.uid);
          } else {
            reject("UserObject not available");
          }
        } catch (error) {
          reject(error);
        }
        removeListener();
      });
    } catch (error) {
      reject(error);
    }
  });
}

Users.getAllUsers = function () {
  return new Promise((resolve, reject) => {
    try {
      const users = [];

      const querySnapshot = getDocs(collection(db, "users"))
        .then((result) => {
          result.forEach((doc) => {
            const userObject = doc.data();
            userObject["id"] = doc.id;

            users.push(userObject);
          });
          resolve(users);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

Users.getUserById = function (uid) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "users", uid);
      getDoc(docRef)
        .then((docSnap) => {
          const userObject = docSnap.data();
          userObject["id"] = docSnap.id;

          resolve(userObject);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

Users.updateUserById = function (uid, updates) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "users", uid);
      updateDoc(docRef, updates)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
export { Users };
