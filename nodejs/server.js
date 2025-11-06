
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000; // You’ll briefly change this in your demo video

// ---- Intentionally weak, in-memory "data" ----
let users = []; // { username, password }
let comments = []; // { author, text, createdAt }
let sessions = []; // { user, sessionId, expires }

// ---- Handlebars setup ----
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'wildwest',              // signing not required by spec, but express-session needs a secret
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false }      // intentionally lax; no secure flags to match the assignment
}));

// Make 'user' available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ---- GET routes ----
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));

app.get('/comments', (req, res) => {
  res.render('comments', { comments });
});

app.get('/comment/new', (req, res) => {
  if (!req.session.user) return res.render('login', { error: 'Please log in first.' });
  res.render('newComment');
});

// ---- POST routes ----
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim()) {
    return res.render('register', { error: 'Username and password required.' });
  }
  if (users.find(u => u.username === username)) {
    return res.render('register', { error: 'Username already taken.' });
  }
  users.push({ username, password }); // plaintext by design
  return res.redirect('/login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const match = users.find(u => u.username === username && u.password === password);
  if (!match) return res.render('login', { error: 'Invalid username or password.' });

  // Mark session logged-in
  req.session.user = username;

  // Intentionally insecure cookies (no signing/flags)
  res.cookie('loggedIn', 'true');
  res.cookie('user', username);

  // Keep a simple in-memory session record (pedagogy)
  sessions.push({
    user: username,
    sessionId: req.sessionID,
    expires: new Date(Date.now() + 60 * 60 * 1000)
  });

  return res.redirect('/');
});

app.post('/logout', (req, res) => {
  // Clear insecure cookies
  res.clearCookie('loggedIn');
  res.clearCookie('user');

  // Remove from in-memory sessions if present
  sessions = sessions.filter(s => s.sessionId !== req.sessionID);

  // Destroy session
  req.session.destroy(() => res.redirect('/'));
});

app.post('/comment', (req, res) => {
  if (!req.session.user) return res.render('login', { error: 'Please log in to post.' });
  const text = (req.body.text || '').trim();
  if (!text) return res.render('newComment', { error: 'Comment cannot be empty.' });

  comments.push({
    author: req.session.user,
    text,
    createdAt: new Date()
  });
  return res.redirect('/comments');
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

