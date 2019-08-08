const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/', function(req, res){
  res.sendFile('index.html');
}); 

app.get('/api/getFile', function(req, res){
  res.sendFile(basepath + '/gabythom/c8jyd9belZNi:NfhxBG5qllHXi+oTv0T4g+xFbSx');
}); 

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

const multer = require("multer");
var basepath = process.cwd();

const multerConfig = {
    
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

app.post('/api/file',multer(multerConfig).array('files',2),function(req,res){   
    res.send('Complete!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
