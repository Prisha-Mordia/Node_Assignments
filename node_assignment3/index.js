// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'secret-key', // Change this to a more secure secret
  resave: false,
  saveUninitialized: true,
}));

// Dummy admin credentials (for demo purposes)
const dummyAdmin = {
  username: 'admin',
  password: 'admin123',
};

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Dummy data for users
let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
];

// Routes
app.get('/', isAuthenticated, (req, res) => {
  res.render('index', { username: dummyAdmin.username });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === dummyAdmin.username && password === dummyAdmin.password) {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

app.get('/users', isAuthenticated, (req, res) => {
  res.render('users', { users });
});

app.get('/users/new', isAuthenticated, (req, res) => {
  res.render('new-user');
});

app.post('/users/new', isAuthenticated, (req, res) => {
  const { name } = req.body;
  const id = users.length + 1;
  const newUser = { id, name };
  users.push(newUser);
  res.redirect('/users');
});

app.get('/users/edit/:id', isAuthenticated, (req, res) => {
  const userId = parseInt(req.params.id);
  const userToEdit = users.find((user) => user.id === userId);
  res.render('edit-user', { user: userToEdit });
});

app.post('/users/edit/:id', isAuthenticated, (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedName = req.body.name;
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index].name = updatedName;
  }
  res.redirect('/users');
});

app.get('/users/delete/:id', isAuthenticated, (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((user) => user.id !== userId);
  res.redirect('/users');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
