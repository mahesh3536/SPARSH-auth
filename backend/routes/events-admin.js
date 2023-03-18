const express = require("express");
const admin = require("../config/firebase-config");
const formidable = require("express-formidable");
const { v4 } = require("uuid");
const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");

router.use(formidable());
const imageUpload = multer({
  dest: "images",
});
const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
} = require("firebase/firestore");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { async } = require("@firebase/util");

const storage = getStorage();

const metadata = {
  contentType: "image/jpeg",
};

router.post("/add-events", async (req, res) => {
  const {
    name,
    description,
    date,
    rulebook,
    day,
    type,
    participants,
    categories,
  } = req.fields;
  const { image } = req.files;

  const imageUpload = async (folder, buffer) => {
    return new Promise((resolve, reject) => {
      uploadBytes(folder, buffer, metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      });
    });
  };

  const data1 = fs.readFileSync(image.path, (err, data) => {
    if (err) console.log(err);
  });
  const imageRefAaId = ref(storage, `events/thumbnail/${name + v4()}`);
  let imageURL = await imageUpload(imageRefAaId, data1);
  // let imageURL = "https://www.clear.com";

  const datadata = {
    name: name,
    description: description,
    date: date,
    imageURL: imageURL,
    rulebook: rulebook,
    participants: participants,
    categories: categories.split(","),
  };
  if (day === "one" && type === "main") {
    const ce_collection = collection(db, "events", "one", "main");
    await addDoc(ce_collection, datadata);
  } else if (day === "one" && type === "normal") {
    const ce_collection = collection(db, "events", "one", "normal");
    await addDoc(ce_collection, datadata);
  } else if (day === "two" && type === "main") {
    const ce_collection = collection(db, "events", "two", "main");
    await addDoc(ce_collection, datadata);
  } else if (day === "two" && type === "normal") {
    const ce_collection = collection(db, "events", "two", "normal");
    await addDoc(ce_collection, datadata);
  } else if (day === "three" && type === "main") {
    const ce_collection = collection(db, "events", "three", "main");
    await addDoc(ce_collection, datadata);
  } else if (day === "three" && type === "normal") {
    const ce_collection = collection(db, "events", "three", "normal");
    await addDoc(ce_collection, datadata);
  }

  return res.status(200).json({ message: "Done" });
});

router.get("/get-events", async (req, res) => {
  const { name } = req.params;
  const data = {
    one: {
      main: {},
      normal: {},
    },
    two: {
      main: {},
      normal: {},
    },
    three: {
      main: {},
      normal: {},
    },
  };
  const ce_collection = collection(db, "events", "one", "main");
  const first = await getDocs(ce_collection);
  const firstfirst = [];
  first.forEach((doc) => firstfirst.push(doc.data()));
  data.one.main = firstfirst;

  const ce_collection1 = collection(db, "events", "one", "normal");
  const first1 = await getDocs(ce_collection1);
  const firstfirst1 = [];
  first1.forEach((doc) => firstfirst1.push(doc.data()));
  data.one.normal = firstfirst1;

  const ce_collection2 = collection(db, "events", "two", "main");
  const first2 = await getDocs(ce_collection2);
  const firstfirst2 = [];
  first2.forEach((doc) => firstfirst2.push(doc.data()));
  data.two.main = firstfirst2;

  const ce_collection3 = collection(db, "events", "two", "normal");
  const first3 = await getDocs(ce_collection3);
  const firstfirst3 = [];
  first3.forEach((doc) => firstfirst3.push(doc.data()));
  data.two.normal = firstfirst3;

  const ce_collection4 = collection(db, "events", "three", "main");
  const first4 = await getDocs(ce_collection4);
  const firstfirst4 = [];
  first4.forEach((doc) => firstfirst4.push(doc.data()));
  data.three.main = firstfirst4;

  const ce_collection5 = collection(db, "events", "three", "normal");
  const first5 = await getDocs(ce_collection5);
  const firstfirst5 = [];
  first5.forEach((doc) => firstfirst5.push(doc.data()));
  data.three.normal = firstfirst5;

  return res.status(200).json({ data: data });
});

module.exports = router;
