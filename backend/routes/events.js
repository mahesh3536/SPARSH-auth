const admin = require("../config/firebase-config");
const path = require("path");
const formidable = require("express-formidable");
const multer = require("multer");
const router = require("express").Router();
const { db } = require("../config/firebase");
const fs = require("fs");
const {
    collection,
    deleteDoc,
    addDoc,
    query,
    where,
    doc,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    getDoc,
    getDocs,
    setDoc,
} = require("firebase/firestore");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const mailer = require("./nodemailer");

const storage = getStorage();
const upload = multer({ dest: "uploads/" });
const metadata = {
    contentType: "image/jpeg",
};
router.use(formidable());

// FOR REFERENCE
// evetSchema = {
//     name,
//     imgurl,
//     date,
//     description,
//     rulebookurl,
// }
router.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "events", "add.html"));
});
router.get("/update", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "events", "update.html"));
});
router.get("/delete", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "events", "delete.html"));
});

router.get("/:name/details", async (req, res) => {
    // let q = query(collection(db, "events"), where("name", "==", req.params.name));
    // let querySS = await getDocs(q);
    let docSnap = await getDoc(doc(db, "events", req.params.name));
    if (!docSnap.exists()) {
        res.json({ success: false, message: "Event does not exist" });
    } else {
        let eventDetails = docSnap.data();
        res.json({ success: true, details: eventDetails });
    }
});

router.post("/add", async (req, res) => {
    const imageUpload = async (folder, buffer, metadata) => {
        return new Promise((resolve, reject) => {
            uploadBytes(folder, buffer, metadata).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    resolve(url);
                });
            });
        });
    };
    let { name, date, venue, description } = req.fields;
    let { imgurl, rulebookurl } = req.files;

    const data1 = fs.readFileSync(imgurl.path, (err, data) => {
        if (err) console.log(err);
    });
    const data2 = fs.readFileSync(rulebookurl.path, (err, data) => {
        if (err) console.log(err);
    });
    const imageRefStorage = ref(storage, `events/images/${name}`);
    const rulebookRefStorage = ref(storage, `events/rulebooks/${name}`);

    const imgURL = await imageUpload(imageRefStorage, data1, { contentType: "image/jpeg" });
    const rulebookURL = await imageUpload(rulebookRefStorage, data2, { contentType: "application/pdf" });

    console.log(req.body);
    let eventObj = { name, venue, date, description, imgURL, rulebookURL };
    console.log(eventObj);

    // let q = query(collection(db, "events"), where("name", "==", name));
    // let querySS = await getDocs(q);
    let docSnap = await getDoc(doc(db, "events", name));
    if (!docSnap.exists()) {
        await setDoc(doc(db, "events", name), { ...eventObj, createdAt: serverTimestamp() });
        // const eventDocRef = await addDoc(collection(db, "events"), { ...eventObj, createdAt: serverTimestamp() });
        console.log("Event created with id: ", name);
        res.json({ success: true, message: "Event created", id: name });
    } else {
        console.log("Event already exists");
        res.json({ success: false, message: "Event already exists" });
    }
});

router.post("/update", async (req, res) => {
    console.log(req.body);
    let { name, imgurl, date, venue, description, rulebookurl } = req.body;
    let eventObj = {};
    if (name && name != "") eventObj.name = name;
    if (imgurl && imgurl != "") eventObj.imgurl = imgurl;
    if (date && date != "") eventObj.date = date;
    if (venue && venue != "") eventObj.venue = venue;
    if (description && description != "") eventObj.description = description;
    if (rulebookurl && rulebookurl != "") eventObj.rulebookurl = rulebookurl;

    // let q = query(collection(db, "events"), where("name", "==", name));
    // let querySS = await getDocs(q);
    let docSnap = await getDoc(doc(db, "events", name));

    if (!docSnap.exists()) {
        res.json({ success: false, message: "Event does not exists" });
    } else {
        await updateDoc(doc(db, "events", name), eventObj);
        res.json({ success: true, message: "Event updated successfully", id: name });
    }
});

router.post("/delete", async (req, res) => {
    console.log("delete");
    let { name } = req.body;
    console.log(name);
    const imageRefStorage = ref(storage, `events/images/${name}`);
    const rulebookRefStorage = ref(storage, `events/rulebooks/${name}`);
    // let q = query(collection(db, "events"), where("name", "==", name));
    // let querySS = await getDocs(q);
    let docSnap = await getDoc(doc(db, "events", name));

    if (!docSnap.exists()) {
        res.json({ success: false, message: "Event does not exists" });
    } else {
        await deleteDoc(doc(db, "events", name));
        await deleteObject(imageRefStorage);
        await deleteObject(rulebookRefStorage);
        res.json({ success: true, message: "Event deleted successfully", id: name });
    }
});

router.post("/register", async (req, res) => {
    const { user, event } = req.body;
    const userRef = collection(db, "userInfo");
    const eventsRef = collection(db, "events");

    if(!user || !event) {
        return res.status(500).json({ success: false, message: "provide user and event" });
    }

    try {
        // check if event is created or not
        // const qEvent = query(eventsRef, where("name", "==", event.toLowerCase()));
        // const eventQuerySS = await getDocs(qEvent);

        let eventRef = await getDoc(doc(db, "events", event.name));
        if (eventRef.exists()) {
            // let registrations = await getDocs(collection(db, "events", event.name, user.email));
            // console.log(registrations.empty);
            // if (registrations.docs.length > 0) {
            //     console.log("Already registered for the event");
            // } else {
            await addDoc(collection(db, "registrations", event.name, user.email), user);
            console.log("Registered", user.name, "for event", event.name);
            // }
        } else {
            console.log("Event does not exists");
            return res.json({ success: false, message: "Event does not exist" });
        }

        // // checking if the user has already registered for the event
        // const eventDoc = await getDoc(doc(db, "events", eventId));
        // const regUsers = eventDoc.data().users;
        // for (let item of regUsers) {
        //     if (item === user.uid) {
        //         return res.status(200).send({ message: "Already registered for the event", user: user });
        //     }
        // }

        // // updating the users in events collection
        // await updateDoc(doc(db, "events", eventId), {
        //     users: arrayUnion(user.uid),
        // });

        // // updating the events registered in userInfo
        // await updateDoc(doc(db, "userInfo", user.uid), {
        //     events: arrayUnion(eventId),
        // });

        const data = {
            name: event,
        };
        mailer.sendMail(user, data);
        return res.status(201).send({ message: "Successfully Registered for the event", user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal Server Error", user: user });
    }
});

// this route will return the user id of all the users registered for the event
router.get("/:name", async (req, res) => {
    try {
        let registeredUsers = [];
        const eventsRef = collection(db, "events");
        const userRef = collection(db, "userInfo");
        const qEvent = query(eventsRef, where("name", "==", req.params.name?.toLowerCase()));
        const querySnapshot = await getDocs(qEvent);

        if (querySnapshot.empty) {
            return res.status(404).json({
                status: "This event does not exist",
            });
        } else {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                registeredUsers.push(doc.data());
            });
        }
        const userIds = registeredUsers[0].users;
        // const qUser = query(userRef, where("uid", "in", registeredUsers[0].users));
        const users = [];
        await Promise.all(
            userIds.map(async (id) => {
                const userDoc = await getDoc(doc(db, "userInfo", id));
                if (userDoc.exists()) {
                    users.push(userDoc.data());
                }
            })
        );
        if (userIds.length === 0) {
            return res.status(404).json({
                status: "No users registered for this event",
            });
        }
        return res.status(200).json({
            data: users,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

module.exports = router;

// TODO
// image and rule book crud operations
// registration collection to store registrations in individual events -> DONE
// replace event doc id with event name -> DONE

// Registration schema
// team name
// name,
// colege name,
// email,
// phone Number,
// gender
