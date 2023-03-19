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

router.post("/post-news", async (req, res) => {
  try {
    const { title, content } = req.fields;
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
    const imageRefAaId = ref(storage, `news/thumbnail/${title + v4()}`);
    let imageURL = await imageUpload(imageRefAaId, data1);

    const datadata = {
      title: title,
      imageURL: imageURL,
      content: content,
    };

    const ce_collection = collection(db, "news");
    await addDoc(ce_collection, datadata);

    return res.status(200).json({ message: "Successfully Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-news", async (req, res) => {
  try {
    const ce_collection = collection(db, "news");
    const result = await getDocs(ce_collection);
    const arr = [];
    result.forEach((doc) => arr.push(doc.data()));
    return res.status(200).json({ data: arr });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
