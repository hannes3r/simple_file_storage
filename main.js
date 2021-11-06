const express = require("express");
const fs = require('fs');
const fileUpload = require("express-fileupload");
const app = express();
const port = 5000;

const html1 = `<html>
                <body>
                    <h1>Simple File Uploader</h1>
                    <form ref='uploadForm' 
                        id='uploadForm' 
                        action='/upload' 
                        method='post'
                        encType="multipart/form-data">
                        <input type="file" name="upFile" />
                        <input type='submit' value='Upload!' />
                    </form>`;
const html2 = `</body></html>`;

app.get("/", (req, res) => {
  var htmlFiles = '<h2>Files</h2>';
  fs.readdir(__dirname + '/files', (err, files) => {
    if (err) throw err;
    files.forEach(f => {
      htmlFiles = htmlFiles + `<a style="background-color:red; color:white;" href="/delete/${f}">X</a>  <a href="/files/${f}">${f}</a><br>`;
    });
    res.contentType("html");
    res.send(html1 + htmlFiles + html2);
  })
});

app.use(fileUpload());

app.get("/files/:name", (req, res) => {
  res.sendFile(`${__dirname}/files/${req.params.name}`);
});

app.get("/delete/:name", (req, res) => {
  fs.rm(__dirname + "/files/" + req.params.name, () => {});
  res.redirect('/')
});

app.post("/upload", function (req, res) {
  let upFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  upFile = req.files.upFile;
  uploadPath = __dirname + "/files/" + upFile.name;

  upFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log("Running...");
});
