// ───────────────────────────────────────────────
// app.js – Entry point for MERN E-Commerce Server
// ───────────────────────────────────────────────

require('dotenv').config(); // Load environment variables first

const express         = require('express');
const cookieParser    = require('cookie-parser');
const session         = require('express-session');
const flash           = require('connect-flash');
const path            = require('path');
const MongoStore      = require('connect-mongo');

const app = express();

// ─── Connect to MongoDB ─────────────────────────
require('./config/mongoose-connection'); // Assumes your file connects & logs

// ─── Middleware Setup ──────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Session Configuration ─────────────────────
if (!process.env.EXPRESS_SESSION_SECRET) {
  throw new Error('❌ EXPRESS_SESSION_SECRET is missing from .env file');
}

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scatch',
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in ms
    },
  })
);

app.use(flash());

// ─── Static Files & View Engine ────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Routers ───────────────────────────────────
const indexRouter    = require('./routes/index');
const ownersRouter   = require('./routes/ownersRouter');
const usersRouter    = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

app.use('/',         indexRouter);
app.use('/owners',   ownersRouter);
app.use('/users',    usersRouter);
app.use('/products', productsRouter);

// ─── 404 Handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found' });
});

// ─── Global Error Handler ──────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).render('500', { error: err.message });
});

// ─── Start Server ──────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
