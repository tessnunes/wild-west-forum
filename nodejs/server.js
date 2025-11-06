const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// In-memory data
const users = [];
const comments = [];

// Handlebars setup
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'wildwest', resave: false, saveUninitialized: true }));

// Middleware to add user info to templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.get('/', (req, res) => res.render('home'));

app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.render('register', { error: 'Username already exists!' });
  }
  users.push({ username, password });
  res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.render('login', { error: 'Invalid credentials!' });
  }
  req.session.user = username;
  res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/comments', (req, res) => {
  res.render('comments', { comments });
});

app.get('/comment/new', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('newComment');
});

app.post('/comment', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const text = req.body.text;
  comments.push({ author: req.session.user, text, createdAt: new Date() });
  res.redirect('/comments');
});

app.listen(3000, () => console.log('Wild West Forum running on port 3000'));
