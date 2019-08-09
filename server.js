const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const multer = require('multer');
const basepath = process.cwd();
const safeEval = require('safe-eval')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/', function(req, res){
  res.sendFile('index.html');
}); 



process.on('uncaughtException', function (err) {
  console.log(err);
}); 

app.get('/api/getFile/:name', function(req, res){
  res.sendFile(basepath + '/gabythom/'+req.params.name);
}); 

app.get('/api/getFile2', function(req, res){
  res.sendFile(basepath + '/hola.js');
}); 

app.post('/api/world', (req, res) => {
  console.log(JSON.parse(req.body));
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});
app.post('/api/createFolder', (req, res) => {
  console.log("holaaa",req.body);
  let data = req.body;
  eval("data = {hi:'hrllo'}");
  console.log("heyyy",data)
  res.json({h:"Hi"})
});

app.post('/api/deleteFile', function(req,res){
  //console.log("holaaa",req);
  let data = req.body;
  console.log("heyyy1",req.body[0])
  console.log("heyyy2",req.body[1])
  console.log("heyyy3",req.body.length )
  for(var i=0;i<req.body.length; i++){
    try {
      fs.unlink(basepath + '/gabythom/'+req.body[i] ,function(err, result){
        if(err) console.log('error', err);
      })
      fs.close()
    } catch (err) {
      console.error("error aquiiii", err)
      fs.close()
    }

  }
  res.json({h:"Hi"})
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/api/holaa',async (req, res) => {
  //const file = basepath+`/hola.js`;
  await res.download("./temporal/hola.js");
  setTimeout(function() {
    fs.unlink(basepath + '/temporal/hola.js', (err) => {
      if (err) throw err;
        console.log('Deleted succesfully');
     });   
}, 500); 
  
});

app.post('/api/postForDownload',  (req, res, next) => {
  //console.log(req.body.file.name)
  //console.log(req.body.file.content.replace(/\s/g, ''))
  var buf = Buffer.from(req.body.file.content.replace(/\s/g, ''), "hex")
  //console.log(buf)
  fs.writeFile('filess/'+req.body.file.name, buf, function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 

   
  //const file = basepath+`/hola.js`;
  res.send("complete");
  // fs.close;

});

 

const multerConfig = {
    
	storage: multer.diskStorage({
	 //Setup where the user's file will go
	 destination: function(req, files, next){
    //console.log("FILESSSSSS",files)
	   next(null,basepath + '/temporal');
	 },   
	
		//Then give the file a unique name
		filename: function(req, files, next){
		//console.log(files);
		next(null, files.originalname);
		  }
		})   
}

app.post('/api/postContentFile',multer(multerConfig).array('files',2),function(req,res){	
  res.send('Complete!');
  console.log("complete")
 }); 

 const multerConfig2 = {
    
  storage: multer.diskStorage({
   //Setup where the user's file will go
   destination: function(req, files, next){
     console.log("files",files)
     next(null,basepath + '/filess');
     },   
  
      //Then give the file a unique name
      filename: function(req, files, next){
      next(null, files.originalname);
        }
      })   
}

app.post('/api/file',multer(multerConfig2).array('files',1),function(req,res){   
res.send('Complete!');
console.log("SavedHere");
});

app.post('/api/file1', (req, res) => {
  console.log();
  console.log();
  try {
    fs.writeFile("./gabythom/"+req.body.file.name, req.body.file.content ,function(err, result){
      if(err) console.log('error', err);
    })
  } catch (err) {
    console.error("error aquiiii", err)
  }
  res.send("ok");
});

 app.post('/api/saveJson', (req, res) => {
  console.log("holaaa",req.body);
  let data = req.body;
  try {
    fs.writeFile("./gabythom/k.txt", data ,function(err, result){
      if(err) console.log('error', err);
    })
  } catch (err) {
    console.error("error aquiiii", err)
  }
  res.json({h:"Hi"})
});

 app.get('/api/getContentFile', function (req, res) {
  var name = req.query.name;
  console.log("name",name)
  fs.readFile(basepath + '/temporal/'+name, function read(err, data) {
    if (err) {
      console.log(err);
    }
     console.log("data",data);
     var dataHexa = data.toString('hex');
     console.log("dataHexa",dataHexa);
      dataHexa = dataHexa.match(/../g).join(' ');
     console.log("dataHexa",dataHexa);
     var arrayHexa = dataHexa.split(" ");
     fs.close;
   
   fs.unlink(basepath + '/temporal/'+name, (err) => {
     if (err) throw err;
       console.log('Deleted succesfully');
    }); 
      console.log("datahexa",dataHexa)
      res.json(dataHexa);

   });
 })

app.get('/download/:name', function(req, res){
  console.log("nameeese",req.params.name)
 
    res.download('filess/'+req.params.name);  

  setTimeout(function() {
    fs.unlink(basepath + '/filess/'+req.params.name, (err) => {
      if (err) throw err;
        console.log('Deleted succesfully');
     });   
}, 500); 
}); 
app.post('/folder', function(req, res){
var fs = require('fs');
var dir = './tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
} 
}); 


app.listen(port, () => console.log(`Listening on port ${port}`));
