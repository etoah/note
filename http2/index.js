const express = require('express');
const fs =  require('fs');
const http2 = require('spdy');
const path = require('path');
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem')
};
const app = new express();
http2
  .createServer(options, app)
  .listen(8080, ()=>{
    console.log(`Server is listening on https://localhost:8080.
     You can open the URL in the browser.`)
  }
)
//app.use('/', express.static(path.join(__dirname, './assets')));

app.get("/",(req,res)=>{
    var stream = res.push('/app.js', {   //服务器推送
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript'
    }
  })
  stream.on('error', function() {
  })
  stream.end('console.log("http2 push stream, by Lucien ");')

  res.send(`hello http2!
    <script src="/app.js"></script>`);//express 并没有host static ,这个app.js 来自push 
})