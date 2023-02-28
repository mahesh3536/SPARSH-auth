const admin = require("../config/firebase-config");
const router = require("express").Router();
const { db } = require("../config/firebase");
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
} = require("firebase/firestore");
const mailer = require("./nodemailer");

router.post("/add", async (req, res) => {
  let { name, imgurl, date, venue, description, rulebookurl } = req.body;
  let eventObj = { name, imgurl, date, venue, description, rulebookurl };
  console.log(eventObj)

  let q = query(collection(db, "events"), where("name", "==", name));
  let querySS = await getDocs(q);
  if (querySS.empty) {
      const eventDocRef = await addDoc(collection(db, "events"), { ...eventObj, createdAt: serverTimestamp() });
      console.log("Event created with id: ", eventDocRef.id);
      res.json({ success: true, message: "Event created", id: eventDocRef.id });
  } else {
      console.log("Event already exists");
      res.json({ success: false, message: "Event already exists" });
  }
});

router.post("/update", async (req, res) => {
  let { name, imgurl, date, venue, description, rulebookurl } = req.body;
  let eventObj = { name, imgurl, venue, date, description, rulebookurl };

  let q = query(collection(db, "events"), where("name", "==", name));
  let querySS = await getDocs(q);
  if (querySS.empty) {
      res.json({ success: false, message: "Event does not exists" });
  } else {
      let eventRef = querySS.docs[0].id;
      console.log(eventRef);
      await updateDoc(doc(db, "events", eventRef),eventObj);
      res.json({ success: true, message: "Event updated successfully", id: eventRef });
  }
});

router.post("/delete", async (req, res) => {
  let { name } = req.body;
  let q = query(collection(db, "events"), where("name", "==", name));
  let querySS = await getDocs(q);

  if (querySS.empty) {
      res.json({ success: false, message: "Event does not exists" });
  } else {
      let eventRef = querySS.docs[0].id;
      await deleteDoc(doc(db, "events", eventRef));
      res.json({ success: true, message: "Event deleted successfully", id: eventRef });
  }
});

router.post("/register", async (req, res) => {
  const { user, event } = req.body;
  const userRef = collection(db, "userInfo");
  const eventsRef = collection(db, "events");

  try {
    // check if event is created or not
    const qEvent = query(eventsRef, where("name", "==", event.toLowerCase()));
    const eventQuerySS = await getDocs(qEvent);

    let eventId; // getting the eventId of the event if not created the after creating
    if (eventQuerySS.empty) {
      const eventDocRef = await addDoc(eventsRef, {
        name: event.toLowerCase(),
        users: [],
        createdAt: serverTimestamp(),
      });
      eventId = eventDocRef.id;
    } else {
      eventId = eventQuerySS.docs[0].id;
    }

    // checking if the user has already registered for the event
    const eventDoc = await getDoc(doc(db, "events", eventId));
    const regUsers = eventDoc.data().users;
    for (let item of regUsers) {
      if (item === user.uid) {
        return res
          .status(200)
          .send({ message: "Already registered for the event", user: user, });
      }
    }

    // updating the users in events collection
    await updateDoc(doc(db, "events", eventId), {
      users: arrayUnion(user.uid),
    });

    // updating the events registered in userInfo
    await updateDoc(doc(db, "userInfo", user.uid), {
      events: arrayUnion(eventId),
    });

    const data = {
      name: event,
    };
    mailer.sendMail(user, data);
    return res
      .status(201)
      .send({ message: "Successfully Registered for the event", user: user });
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
    const qEvent = query(
      eventsRef,
      where("name", "==", req.params.name?.toLowerCase())
    );
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
    const users = []
    await Promise.all(
       userIds.map(async (id) => {  
        const userDoc = await getDoc(doc(db, "userInfo", id));
        if(userDoc.exists()){
          users.push(userDoc.data())
        }  
      })
    )
    if(userIds.length === 0){
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
