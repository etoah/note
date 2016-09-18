const Koa = require('koa2');
const fs =  require('fs');
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem')
};
const http = require('http2')
var sever=http.createServer.bind(http,options);
const app = new Koa(sever);
app.use((ctx, next) => {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});
// response
app.use(ctx => {
  ctx.body = 'Hello Koa in app.js';
});
app.listen(3000);