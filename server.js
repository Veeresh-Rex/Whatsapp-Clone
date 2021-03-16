const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongodb = require('mongoose');
const Messages = require('./Model/messages');
const cors = require('cors');
require('dotenv').config();
MONGODB_URI = `mongodb+srv://leet-rex:${process.env.DB_PASS}@password-auth.uagdt.mongodb.net/${process.env.DB_NAME}`;

var Pusher = require('pusher');
app.use(cors());
app.use(express.json()); //  middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

var pusher = new Pusher({
  appId: '1086800',
  key: 'd5deb69fbf831c9a613e',
  secret: 'f8dc468ad09e8ed124bd',
  cluster: 'ap2',
  useTLS: true,
});

const db = mongodb.connection;
db.once('open', () => {
  console.log('db connected');
  const msgCollection = db.collection('messages');
  //console.log(msgCollection);
  const changeStream = msgCollection.watch();
  // console.log(changeStream);
  changeStream.on('change', (change) => {
    console.log('A change is : ' + change);
    if (change.operationType === 'insert') {
      const msgDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        name: msgDetails.name,
        message: msgDetails.message,
        timestamp: msgDetails.timestamp,
        recieved: msgDetails.recieved,
      });
    } else {
      console.log('Errow while pusher triggering');
    }
  });
});

mongodb
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo db is connected');
  })
  .catch((err) => {
    console.log(err);
  });
app.get('/messages/sync', (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.post('/messages/new', (req, res) => {
  const dbmessage = req.body;
  Messages.create(dbmessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
