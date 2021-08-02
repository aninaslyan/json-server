import jsonServer from 'json-server';
import bodyParser from 'body-parser';

import authRoutes from './routes/user/authentication';
import userRoutes from './routes/user/users';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.db = router.db;

// todo implement Permission rules
// const rules = auth.rewriter({
//     users: 400,
//     items: 600,
//     products: 644,
// });

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// routes
server.use(authRoutes);
server.use('/users', userRoutes);
server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Running on port ${port}`);
});
