const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const profile = require('./controllers/profile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const sessionManager = require('./controllers/sessionManager');
const serverDefaultPort = 3000;

if (process.env.NODE_ENV === 'development') {
  try {
    require('dotenv').config({ path: '.env.development' });
    console.log('✅ Development environment loaded');
    console.log('NODE_ENV after dotenv:', process.env.NODE_ENV);
  } catch (error) {
    console.log('No .env.development file found');
  }
} else {
  console.log('✅ Production environment detected');
}

const db = process.env.NODE_ENV === 'development' ? knex({ 
      // connect to your own database when NODE_ENV = development
      client: 'pg',
      connection: {
        host : process.env.DATABASE_HOST,
        user : process.env.DATABASE_USER,
        password : '',
        database : process.env.DATABASE_NAME
      }
    }) :
    // else connect to production database:
    knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    }
  });

// create our app by running express
const app = express();
const morgan = require('morgan');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
	res.send('it is working!!!');
});

app.post('/signin', signin.signinAuthiedication(db, bcrypt)); // keep it just to show another way
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, db)});
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)});
app.put('/image', auth.requireAuth, (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', auth.requireAuth, (req, res) => {image.handleApiCall(req, res)});
app.post('/signout', (req, res) => signout.deleteRedisEntry(req, res)); 
app.get('/test-redis', (req, res) => sessionManager.test_RedisDb(req, res));

app.listen(process.env.PORT || serverDefaultPort, ()=> {
  if (process.env.PORT) {
    console.log(`App is running on port ${process.env.PORT}`);
  } else {
    console.log(`App is running on port ${serverDefaultPort}`);
  }
});
