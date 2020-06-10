const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://desarrollo-web-5c200.firebaseio.com/"
});

const database = admin.database();

///========================= Variables globales ===================///
const dbPhones = "phones";

///========================= Métodos internos ===================///


function createPhone(phone){
  database.ref(dbPhones).push(phone);
}
/*********************Retrive Phones*******************/
function retrievePhone(id){
  return database.ref(dbPhones).child(id).once('value');
}
/*********************Update Phones*******************/
function updatePhone(id, phone){
  database.ref(dbPhones).child(id).set(phone)
}
/*********************Delete Phones*******************/
function deletePhone(id){
  database.ref(dbPhones).child(id).remove();
}
/*********************List Phones*******************/
function listPhones(){
  return database.ref(dbPhones).once('value');
}



///========================= Funciones URLs ===================///


app.post('/api/phones', function(req, res){
  let varBrand = req.body['brand'];
  let varMod = req.body['model'];
  let varStor = req.body['storage'];
  let varMem = req.body['rammem'];
  var phone = {
      brand: varBrand,
      model: varMod,
      storage: varStor,
      rammem: varMem
  }
  createPhone(phone);
  return res.status(201).json({message: `Success phone was added ${phone.id}`})
});



app.get('/api/phones/:id', function(req, res){
  let varId = req.params.id;
  retrievePhone(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/phones/:id', function (req, res) {
  let varId = req.params.id;
  let varBrand = req.body['brand'];
  let varMod = req.body['model'];
  let varStor = req.body['storage'];
  let varMem = req.body['rammem'];
  var phone = {
    brand: varBrand,
      model: varMod,
      storage: varStor,
      rammem: varMem  
  };
  updatePhone(varId, phone);
  return res.status(200).json({ message: "Success phone was updated." });
});

app.delete('/api/phones/:id',function(req, res){
  let varId = req.params.id;
  deletePhone(varId);
  return res.status(200).json({ message: "Success phone was deleted." });
});

app.get('/api/phones/:id', function(req, res){
  let varId = req.query.id;
  retrievePhone(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.get('/api/phones', function(req, res){
  listPhones().then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});



exports.app = functions.https.onRequest(app);
