const express = require('express')
const admin = require("../config/firebase-config");
const formidable = require('express-formidable');
const { v4 } = require("uuid");
const router = require("express").Router();
const fs = require("fs");
const multer = require('multer')

router.use(formidable());
const imageUpload = multer({
    dest: 'images',
});
const { db } = require("../config/firebase");
const {
    collection,
    addDoc,
  getDoc,
  getDocs,
  doc
} = require("firebase/firestore");


const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { async } = require('@firebase/util');

const storage = getStorage();   

const metadata = {
    contentType: 'image/jpeg',
};


router.get('/' , (req , res) => {
    fs.readFile(__dirname + '/../html/form1.html', 'utf8', function(err, text){
        res.send(text);
    });
})

router.post("/register", async (req, res) => {

    const { name, contact_info, email, institute_name, course, year, department, LinkedIn, instagram, Facebook, Why_do_you_want_to_be_campus_ambassadors } = req.fields;
    const { College_ID_card, Aadhar_card } = req.files;
    let College_ID_cardURL, Aadhar_cardURL;

    const imageUpload = async (folder, buffer) => {
        return new Promise((resolve, reject) => {
            uploadBytes(folder, buffer, metadata).then(snapshot => {
                getDownloadURL(snapshot.ref).then(url => {
                    resolve(url);
                })
            })
        })
    }
    
    const data1 = fs.readFileSync(Aadhar_card.path, (err, data) => {
        if (err)
            console.log(err);
    })
    const imageRefAaId = ref(storage, `campusAmbassador/aadharId/${name + v4()}`);

    const data2 = fs.readFileSync(College_ID_card.path, (err, data) => {
        if (err)
            console.log(err);

    })
    const imageRefcoId = ref(storage, `campusAmbassador/collegeID/${name + v4()}`);
    Aadhar_cardURL = await imageUpload(imageRefAaId, data1);
    College_ID_cardURL = await imageUpload(imageRefcoId, data2);

    const data = {
        "name": name ? name : "Not Provided",
        "contact_info": contact_info ? contact_info : "Not Provided",
        "email": email ? email : "Not Provided",
        "Academics": {
            "institute_name": institute_name ? institute_name : "Not Provided",
            "course": course ? course : "Not Provided",
            "year": year ? year : "Not Provided",
            "department": department ? department : "Not Provided",
        },

        "Social_media": {
            "linkedIn": LinkedIn ? LinkedIn : "Not Provided",
            "instagram": instagram ? instagram : "Not Provided",
            "Facebook": Facebook ? Facebook : "Not Provided",
        },
        "Aadhar_cardURL": Aadhar_cardURL ? Aadhar_cardURL : "Not Provided",
        "College_ID_cardURL": College_ID_cardURL ? College_ID_cardURL : "Not Provided",
        "Why_do_you_want_to_be_campus_ambassadors": Why_do_you_want_to_be_campus_ambassadors ? Why_do_you_want_to_be_campus_ambassadors : "Not Provided",
    }
    const ce_collection = collection(db, "campusAmbassador");

    await addDoc(ce_collection, data);

    fs.readFile(__dirname + '/../html/form1.html', 'utf8', function(err, text){
        console.log('confirm');
        res.send(text);
    });

});

router.get("/info" , async (req , res) => {

    const docRef = collection(db, "campusAmbassador");
    const docSnap = await getDocs(docRef);

    let docs = [];
    docSnap.forEach(doc => docs.push(doc.data()));

    console.log(docs);

    res.status(201).json({data: docs});
})


module.exports = router;