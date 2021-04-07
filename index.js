const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const session = require('express-session');
const passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', port);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const Strategy = require('passport-discord').Strategy;
const { clientId, clientSecret, scopes, redirectUri } = require('./config.js');

passport.use(new Strategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: redirectUri,
    scope: scopes,
    prompt: 'consent'
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));


app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(session({
    secret: 'meow meow im a cow',
    resave: false,
    saveUninitialized: false,
    expires: 604800000,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index', { 
      pageTitle: 'Dashboard', user: req.session.user || null
    });
});

app.get('/authorize', passport.authenticate('discord', { 
  scope: scopes, prompt: 'consent' 
}), function(req, res) {});

app.get('/callback', passport.authenticate('discord', { 
  failureRedirect: '/' 
}), function(req, res) { 
  req.session.user = req.user; 
  req.session.user.tag = req.user.username + '#' + req.user.discriminator;
  res.redirect('/'); 
})


app.get('/authorize/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.get('/servers', function(req, res) {
  if (!req.session.user) return res.redirect('/authorize');
  console.log(Object.keys(req.session.user.guilds[0]))
  res.render('servers.ejs', {
    servers: req.session.user.guilds.filter(x=>(x.owner)),
    user: req.session.user,
    tag: req.session.user.tag,
    pageTitle: 'Servers'
  })
})

app.listen(port, () => console.info(`Listening on port ${port}`));
