const jsonServer = require('json-server');
// const fs = require('fs');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
// const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const port = process.env.PORT || 5000;

server.db = router.db;

// todo implement Permission rules
// const rules = auth.rewriter({
//     users: 400,
//     items: 600,
//     products: 644,
// });

server.use(router);

server.listen(port, () => {
    console.log('Running');
});
