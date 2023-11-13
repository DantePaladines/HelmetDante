const express = require('express');
const app = express();

const helmet = require("helmet")

module.exports = app;
const api = require('./server.js');

app.use(express.static('public'));

app.use(helmet.hidePoweredBy())

app.use(helmet.frameguard({
  action : 'deny'
}))
// este es utilizado para nevagadores de versiones antiguas
app.use(helmet.xssFilter())

app.use(helmet.noSniff())

// esto sirve para segurar nuestra pagina en IE 
app.use(helmet.ieNoOpen())

const ninetyDaysInSeconds = 7776000

app.use(helmet.hsts({
  maxAge: ninetyDaysInSeconds, // hacen recordar que la pagina se debe de navegar con https de forma segura
  force: true
}))

app.use(helmet.dnsPrefetchControl())

//No se suele desabilitar
//Solo para actulizaciones de pagina web
app.use(helmet.noCache())

app.use(helmet.contentSecurityPolicy({
  directives : {
    defaultSrc : ["'self'", "'trusted-cdn.com'"],

  }
}))

app.disable('strict-transport-security');

app.use('/_api', api);

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
