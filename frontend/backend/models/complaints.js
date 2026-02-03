const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    cid: String,
    category: String,
    description: String,
    imageUrl: String,
    aiLabel: String,
    lat: Number,
    lon: Number,
    ward: String,
    status: { type: String, default: "Submitted" },
    priority: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);