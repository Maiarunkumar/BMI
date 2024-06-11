const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://gowthammoorthy13:gowtham@cluster0.a914qzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const videoSchema = new mongoose.Schema({
    title: String,
    text: String,
    videoUrl: String
});

const Video = mongoose.model('Video', videoSchema);

app.post("/add", async (req, res) => {
    try {
        const newVideo = new Video({
            title: req.body.title,
            text: req.body.content,
            videoUrl: req.body.video
        });
        await newVideo.save();
        res.send({ error: false });
    } catch (err) {
        console.error(err);
        res.send({ error: true, message: err.message });
    }
});

app.get("/video", async (req, res) => {
    try {
        const videos = await Video.find();
        res.send({ videos });
    } catch (err) {
        console.error(err);
        res.send({ error: true, message: err.message });
    }
});

app.put("/edit", async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.body.id, {
            title: req.body.title,
            text: req.body.content,
            videoUrl: req.body.video
        }, { new: true });
        
        if (updatedVideo) {
            res.send({ error: false });
        } else {
            res.send({ error: true, message: "Video not found" });
        }
    } catch (err) {
        console.error(err);
        res.send({ error: true, message: err.message });
    }
});

app.post("/delete", async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.body.id);
        res.send({ error: false });
    } catch (err) {
        console.error(err);
        res.send({ error: true, message: err.message });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log("App is running on port:", port);
});