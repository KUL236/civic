const router = require("express").Router();
const Complaint = require("../models/Complaint");
const admin = require("firebase-admin");
const firestore = admin.firestore ? admin.firestore() : null;

router.post("/", async (req, res) => {
    // normalize body to include both desc and description
    const body = {
        cid: req.body.cid,
        category: req.body.category,
        description: req.body.description || req.body.desc,
        desc: req.body.desc,
        mobile: req.body.mobile,
        lat: req.body.lat,
        lon: req.body.lon,
        status: req.body.status || "Submitted",
        verifyCount: req.body.verifyCount || 0,
        likes: req.body.likes || 0,
        imageUrl: req.body.imageUrl,
        aiLabel: req.body.aiLabel,
        ward: req.body.ward,
        priority: req.body.priority
    };

    const c = new Complaint(body);
    await c.save();
    
    // also push to firestore if available
    if (firestore) {
        try {
            await firestore.collection("complaints").add({
                cid: c.cid,
                category: c.category,
                desc: c.desc,
                description: c.description,
                mobile: c.mobile,
                status: c.status,
                lat: c.lat,
                lon: c.lon,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                verifyCount: c.verifyCount || 0,
                likes: c.likes || 0
        } catch (e) {
            console.error("Failed to sync to Firestore", e);
        }
    }

    res.json(c);
});

router.get("/", async (req, res) => {
    const data = await Complaint.find();
    res.json(data);
});

router.get("/:cid", async (req, res) => {
    const data = await Complaint.findOne({ cid: req.params.cid });
    res.json(data);
});

router.put("/:cid/status", async (req, res) => {
    await Complaint.updateOne({ cid: req.params.cid }, { status: req.body.status });

    if (firestore) {
        try {
            const snapshot = await firestore.collection("complaints").where("cid","==",req.params.cid).get();
            snapshot.forEach(doc => {
                doc.ref.update({ status: req.body.status });
            });
        } catch (e) {
            console.error("Firestore status update failed", e);
        }
    }

    res.send("Updated");
});

module.exports = router;