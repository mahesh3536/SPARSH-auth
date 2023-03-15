import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAM40dAArC96r9KKNvOzM7g2WQQqDJka10",
    authDomain: "fir-basics-35bef.firebaseapp.com",
    projectId: "fir-basics-35bef",
    storageBucket: "fir-basics-35bef.appspot.com",
    messagingSenderId: "342966114039",
    appId: "1:342966114039:web:8bcbdaf7ec54a729f765f2",
    measurementId: "G-BHZDSN09D5",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// const form = document.querySelector("form");
const image = document.querySelector("#image");

function uploadImage() {
    const file = image.files[0];
    const imagesRef = ref(storage, `images/${file.name}`);
    const metadata = { contentType: file.type };
    uploadBytes(imagesRef, file, metadata).then((snapshot) => {
        console.log("Succesfully uploaded image");
    });
}

image.addEventListener('change',() => {
    console.log('uploading');
    uploadImage();
})

// document.querySelector('file').addEventListener('')