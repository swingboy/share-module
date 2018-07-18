var koa = require('koa');
var staticServer = require('koa-static');
var app = new koa();
var port = 3000;
app.use(staticServer(__dirname));

app.listen(port, function() {
  console.log('server listening on port: ' + port);
});

