const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const Photo = require('./models/Photo');
const photoControllers=require("./controllers/photoControllers")
const pageControllers=require("./controllers/pagesControllers");

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
app.use(methodOverride('_method',{
  methods:["POST","GET"]
}));

//ROUTES
app.get('/', photoControllers.getAllPhoto);
app.get('/photos/:id', photoControllers.getPhoto);
app.post('/photos', photoControllers.createPhoto);
app.put("/photos/:id",photoControllers.updatePhoto);
app.delete("/photos/:id",photoControllers.deletePhoto);

app.get("/about",pageControllers.getAboutPage);
app.get('/add',pageControllers.getAddPage );
app.get('/photo/edit/:id', pageControllers.getEditPage);


const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
