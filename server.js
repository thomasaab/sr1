const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const multer = require('multer');
const basepath = process.cwd();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/', function(req, res){
  res.sendFile('index.html');
}); 

app.get('/api/getFile', function(req, res){
  res.sendFile(basepath + '/gabythom/mEe2L4AWDzlyLeVyWrhv9dnVZ8PPygqmIg==');
}); 

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/api/postForDownload', (req, res) => {
  //console.log(req.body.file.name)
  //console.log(req.body.file.content.replace(/\s/g, ''))
  var buf = Buffer.from(req.body.file.content.replace(/\s/g, ''), "hex")
  //console.log(buf)
  fs.writeFile('mynewfile3.jpg', buf, function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
  fs.close;
});

const multerConfig = {
    
	storage: multer.diskStorage({
	 //Setup where the user's file will go
	 destination: function(req, files, next){
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

 app.get('/api/getContentFile', function (req, res) {
   var name = req.query.name;
 console.log("name",name)
  fs.readFile(basepath + '/temporal/'+name, function read(err, data) {
    if (err) {
      console.log(err);
    }
     console.log("data",data);
     var dataHexa = data.toString('hex').match(/../g).join(' ');
     console.log("dataHexa",dataHexa);
     var arrayHexa = dataHexa.split(" ");
     fs.close;
   
    // fs.unlink(basepath + '/temporal/'+name, (err) => {
    //   if (err) throw err;
    //     console.log('Deleted succesfully');
    // }); 
      fs.close;
      res.json(dataHexa);

   });
 })

const multerConfig2 = {
    
    storage: multer.diskStorage({
     //Setup where the user's file will go
     destination: function(req, files, next){
       next(null,basepath + '/gabythom');
       },   
    
        //Then give the file a unique name
        filename: function(req, files, next){
        //console.log(files);
        next(null, files.originalname);
          }
        })   
}

app.post('/api/file',multer(multerConfig2).array('files',2),function(req,res){   
    res.send('Complete!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
