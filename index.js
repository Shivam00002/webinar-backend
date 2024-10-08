const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const multer = require('multer');
var cors = require('cors');
const connectDb = require("./db");
dotenv.config();

const start = async () => {
  const app = express();
  app.use(cors());
  const port = process.env.PORT || 3000;
  app.use(express.json());


  const WebinarSchema = new mongoose.Schema({
    title: String,
    teacher_name: String,
    description: String,
    teacher_img: String,
    date: String,
    time: String,
    price: String,
    video_url: String
  });



  const Webinar = mongoose.model('Webinar', WebinarSchema);

  // Post data
  const create = async (req, res) => {
    const { title, teacher_name, description, teacher_img, date, time, price, video_url } = req.body;

    const webinar = await Webinar.create({
      title,
      teacher_name,
      description,
      teacher_img,
      date,
      time,
      price,
      video_url
    });

    res.json({ Webinar: webinar });
  };


  // Get all data
  const getData = async (req, res) => {
    const Webinars = await Webinar.find();
    res.json({ Webinars: Webinars });
  };

  // Find by id
  const fetchWebinar = async (req, res) => {
    const WebinarId = req.params.id;
    try {
      const webinarById = await Webinar.findById(WebinarId);
      if (!webinarById) {
        return res.status(404).json({ error: "Webinar not found" });
      }
      res.json({ Webinar: webinarById });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const deleteData = async (req, res) => {
    const webId = req.params.id;
    const webinar = await Webinar.deleteOne({ _id: webId });
    res.json({ success: "Record deleted" });
  };



  const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'image/')
    },
    filename: function (req, file, cb) {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  })

  const imageUpload = multer({ storage: imageStorage })

  app.post("/data", imageUpload.single('image'), create);
  app.get("/data", getData);
  app.delete('/data/:id', deleteData);
  app.get('/data/:id', fetchWebinar);
  connectDb().then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  });
};

start();