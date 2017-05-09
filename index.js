const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const TwitterPackage = require('twitter');
const Event = require('./server/controllers/events');
const Path = require('path');
const User = require('./server/models/user.js');

require('dotenv').config();
// connect to the database and load models
require('./server/models').connect(process.env.MONGO_KEY);

const twitSecret = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

const PORT = process.env.PORT || 3000;
const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());
app.use(passport.session());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');

passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');

app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.get('/googlekey', (req, res) => {
  res.status(200).json(process.env.GOOGLE_MAP);
});

app.post('/makeevent', (req, res) => {
  console.log(req.body, 'event body');
  Event.createEvent(req.body);
  res.send('event made');
});

app.post('/makeevent', (req, res) => {
  console.log(req.body, 'event body');
  req.body.attendees = {};
  Event.createEvent(req.body);
});

/**
 * Route to get events for both user, and events page
 * @param req.body, if it contains the username, then get
 * that user's events
 * @return Sets the state detailbox to the clicked event
 */
app.get('/events', (req, res) => {
  if (!req.body.username) {
    Event.findAll().then(events => res.send(events));
  } else {
    res.json(Event.findUserevent(req.body.username));
  }
});

app.post('/addAttendee', (req, res) => {
  console.log(req, 'req.body');
  console.log(Event, 'event')
  // Event.findOneandUpdate({ title: req.params.event },
  //   { $set: { attendees: { [req.param.username]: true } } },
  //   {}, (err, data) => {
  //     if (err) { console.error(err, 'Error'); } else { console.log(data, 'Data'); res.send('gotcha'); }
  //   });
});

app.post('/deleteAttendee', (req, res) => {
  console.log(req, 'req.params');
  // Event.findOneandUpdate({ title: req.params.event },
  //  { attendees: { [req.param.username]: true } },
  //   {}, (err, data) => {
  //     if (err) { console.error(err, 'Error'); } else { console.log(data, 'Data'); res.send('gotcha'); }
  //   });
});

app.get('/user/picture/*', (req, res) => {
  console.log(req.params[0]);
  User.findOne({ email: req.params[0] }, (err, result) => {
    console.log(result, 'result of find picture on user');
    res.send(200, result.image);
  });
});

app.put('/add/picture', (req, res) => {
  // Need to get clientID then use User model to add that user
  console.log(req.body, 'this is the req.est body to add a pic');
  User.findOneAndUpdate({ email: req.body.email }, { image: req.body.pictureUrl }, {}, (err, data) => {
    if (err) { console.error(err); }
    console.log(data, 'data');
    res.send('sup');
  });
});

const Twitter = new TwitterPackage(twitSecret);

Twitter.stream('statuses/filter', { track: '#Hola' }, (stream) => {
  stream.on('data', (tweet) => {
    // console.log(tweet, tweet.text, 'this is a tweet!');
    // enter tweet into database
  });
  stream.on('error', (error) => {
    console.error(error);
  });
});
// maybe need to store this in the database????

// added this JavaScript/JSON snippet
app.get('/user/events/*', (req, res) => {
 // Events.find({ email: req.body.email }).then((person) => {
  res.send(200, [{ "_id" : "591164baab50ff2b3997f4d7", "title" : "Party in the Dolphin", "eventTime" : "3:37 AM", "eventDate" : "Wed May 10 2017   ", "tags" : "#dolphinparty", "businessName" : "", "picLink" : "", "busLink" : "", "description" : "check out the dolphin", "location" : "748 Camp St, New Orleans, LA 70130, USA longitude: -90.0700232  , latitude: 29.945947", "eventTimeObj" : "2017-05-09T08:37:43Z", "eventDateObj" : "2017-05-10T05:00:00Z", "username" : "zachary", "__v" : 0 }, { "_id" : "591164baab50ff2b3997f4d7", "title" : "Jalso All Nighter", "eventTime" : "3:37 AM", "eventDate" : "Wed May 10 2017   ", "tags" : "#jalsoallnighter", "businessName" : "", "picLink" : "", "busLink" : "", "description" : "working on code", "location" : "748 Camp St, New Orleans, LA 70130, USA longitude: -90.0700232  , latitude: 29.945947", "eventTimeObj" : "2017-05-09T08:37:43Z", "eventDateObj" : "2017-05-10T05:00:00Z", "username" : "zachary", "__v" : 0 }]);
 // });
});
app.get('*', (req, res) => {
  res.sendFile(Path.resolve(__dirname, './server/static/index.html'));
});


// start the server
app.listen(PORT, (err, success) => {
  if (err) {
    return console.error(err, 'Error!!!!');
  }
  return console.log(`Server is running on ${PORT}`);
});
