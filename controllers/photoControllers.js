const fileUpload = require('express-fileupload');

const fs=require("fs");

const Photo = require('../models/Photo');


exports.getAllPhoto = async (req, res) => {
  //res.sendFile(path.resolve("./temp/index.html"));
  //res.sendFile(path.resolve(__dirname,"temp/index.html")); ejs kullanıldığından kaldırıdk
  const photos = await Photo.find().sort('-dateCreated');
  res.render('index', { photos });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  res.render('photo', { photo });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  let imageDelete = __dirname + '/../public' + photo.image;
  fs.unlinkSync(imageDelete);
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect(`/`);
};
