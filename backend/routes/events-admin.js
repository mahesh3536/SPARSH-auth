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
  setDoc,
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
  try {
    const {
      name,
      description,
      date,
      rulebook,
      color,
      participants,
      categories,
      googleFormSvnitian,
      googleFormNonSvnitian,
    } = req.fields;
    const { image } = req.files;

    // console.log(req.files, req.fields);

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
      color: color,
      rulebook: rulebook,
      participants: participants,
      googleFormSvnitian: googleFormSvnitian,
      googleFormNonSvnitian: googleFormNonSvnitian,
    };

    // if (day === "one" && type === "main") {
    //   const ce_collection = collection(db, "events", "one", "main");
    //   await addDoc(ce_collection, datadata);
    // } else if (day === "one" && type === "normal") {
    //   const ce_collection = collection(db, "events", "one", "normal");
    //   await addDoc(ce_collection, datadata);
    // } else if (day === "two" && type === "main") {
    //   const ce_collection = collection(db, "events", "two", "main");
    //   await addDoc(ce_collection, datadata);
    // } else if (day === "two" && type === "normal") {
    //   const ce_collection = collection(db, "events", "two", "normal");
    //   await addDoc(ce_collection, datadata);
    // } else if (day === "three" && type === "main") {
    //   const ce_collection = collection(db, "events", "three", "main");
    //   await addDoc(ce_collection, datadata);
    // } else if (day === "three" && type === "normal") {
    //   const ce_collection = collection(db, "events", "three", "normal");
    //   await addDoc(ce_collection, datadata);
    // }

    const ce_collection = collection(db, "events", categories, "events");
    await setDoc(doc(ce_collection, name), datadata);

    return res.status(200).json({ message: "Successfully Added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-events/:category", async (req, res) => {
  const { category } = req.params;

  const ce_collection = collection(db, "events", category, "events");
  const data = await getDocs(ce_collection);
  const datadata = [];
  data.forEach((doc) => {
    if (doc.data()) datadata.push(doc.data());
  });

  return res.status(200).json({ data: datadata });
});

module.exports = router;
