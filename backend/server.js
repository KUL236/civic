require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");

// initialize Firebase Admin (ensure service account JSON path or env var set)
try {
    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (e) {
    console.warn("Firebase admin credentials not found, firestore sync will be disabled.");
}

const firestore = admin.firestore && admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/api/complaints", require("./routes/complaints"));

app.listen(5000, () => console.log("Server running on 5000"));