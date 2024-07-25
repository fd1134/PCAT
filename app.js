const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')

const fs=require("fs");
const ejs = require('ejs');
const path = require('path');

const Photo = require('./models/Photo');


const app = express();

//Connect DB
main()
  .then(console.log('db Bağlantısı Başarılı'))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

//ROUTES
app.get('/', async (req, res) => {
  //res.sendFile(path.resolve("./temp/index.html"));
  //res.sendFile(path.resolve(__dirname,"temp/index.html")); ejs kullanıldığından kaldırıdk
  const photos = await Photo.find().sort('-dateCreated');
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir);
  }
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
    res.redirect('/');
  });

});

app.get('/photos/:id', async (req, res) => {
  const photo=await Photo.findById(req.params.id)
  
  res.render("photo",{photo});
});

app.get('/photo/edit/:id', async (req, res) => {
  const photo=await Photo.findById(req.params.id);
  res.render('edit',{photo});
});

const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
