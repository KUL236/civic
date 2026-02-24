const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    cid: String,
    category: String,
    description: String,          // long text
    desc: String,                 // alias used in some code
    mobile: String,
    imageUrl: String,
    aiLabel: String,
    lat: Number,
    lon: Number,
    ward: String,
    status: { type: String, default: "Submitted" },
    verifyCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    priority: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);