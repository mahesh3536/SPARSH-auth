const express = require("express");
const router = express.Router();
const app = express();
const mailer = require('./nodemailer')

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    doc,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    getDoc,
    getDocs,
} = require("firebase/firestore");


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAM40dAArC96r9KKNvOzM7g2WQQqDJka10",
    authDomain: "fir-basics-35bef.firebaseapp.com",
    projectId: "fir-basics-35bef",
    storageBucket: "fir-basics-35bef.appspot.com",
    messagingSenderId: "342966114039",
    appId: "1:342966114039:web:8bcbdaf7ec54a729f765f2",
    measurementId: "G-BHZDSN09D5",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

app.use(express.json())

router.post("/register", async (req, res) => {
    const { user, event } = req.body;
    console.log(user);
    console.log(event);
    const eventsRef = collection(db, "events");
    const usersRef = collection(db, "users");

    try {
        // query to find if user is already registered
        const q = query(usersRef, where("event", "==", event), where("email", "==", user.email));
        const querySS = await getDocs(q);

        // check if user is already registered for the event.
        if (querySS.empty) {
            const qEvent = query(eventsRef, where("name", "==", event));
            const eventQuerySS = await getDocs(qEvent);
            let eventID = null;

            if (eventQuerySS.empty) {
                const eventDocRef = await addDoc(eventsRef, {
                    name: event,
                    user: [],
                    createdAt: serverTimestamp(),
                });
                eventID = eventDocRef.id;
            } else {
                // console.log(eventQuerySS.docs[0]);
                eventID = eventQuerySS.docs[0].id;
            }

            const eventDoc = await getDoc(doc(db, "events", eventID));
            let registeredID = 0;
            if (eventDoc.data().users) {
                registeredID = eventDoc.data().users.length;
            }

            const userDocRef = await addDoc(usersRef, {
                ...user,
                registeredID: registeredID + 1,
                createdAt: serverTimestamp(),
            });
            await updateDoc(doc(db, "events", eventID), { users: arrayUnion(userDocRef.id) });
            console.log("User created with id: ", userDocRef.id);

            res.status(200).json({ succes: true, message: "User registered", id: userDocRef.id });

            mailer.sendMail(user)
        } else {
            res.json({ success: false, message: "User already registered for given event" });
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
});

router.get("/:name", async (req, res) => {
    try {
        let registeredUsers = [];
        const q = query(collection(db, "users"), where("event", "==", req.params.name));

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            res.status(404).json({
                status: "This event does not exist",
            });
        } else {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                registeredUsers.push(doc.data());
            });
            console.log(registeredUsers);
            res.status(200).json({
                data: registeredUsers,
            });
        }
    } catch (e) {
        res.status(404).json({
            status: "Unsuccessful",
        });
    }
});

module.exports = router;

