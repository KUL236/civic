const router = require("express").Router();
const Complaint = require("../models/Complaint");

router.post("/", async (req, res) => {
    const c = new Complaint(req.body);
    await c.save();
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
    res.send("Updated");
});

module.exports = router;