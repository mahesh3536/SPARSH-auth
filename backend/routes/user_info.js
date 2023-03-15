const admin = require("../config/firebase-config");
const path = require("path");
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

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const sendData = {
      name: data.name,
      gender: data.gender,
      college_name: data.college_name,
      phone_no: data.phone_no,
    };

    const userRef = collection(db, "userInfo");

    await updateDoc(doc(userRef, req.body?.uid), sendData);

    return res.status(201).json({ message: "Successfully Updated" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
