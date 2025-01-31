const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const profile = require('./controllers/profile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const serverDefaultPort = 3000;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  }
});

// create our app by running express
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('it is working!!!');
});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.post('/signin', signin.handleSignin(db, bcrypt)); // keep it just to show another way
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || serverDefaultPort, ()=> {
  if (process.env.PORT) {
    console.log(`App is running on port ${process.env.PORT}`);
  } else {
    console.log(`App is running on port ${serverDefaultPort}`);
  }
	
});
