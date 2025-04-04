require('dotenv').config();
const express = require("express");
const session = require('express-session');
const bcrypt = require("bcryptjs");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json());  // For JSON data

// Use session management
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Get the functions in the db.js file to use
const db = require('./services/db');

// About us Route
app.get('/about-us', (req, res) => {
  res.render('about-us');
});

// Root Route
app.get("/", function(req, res) {
  console.log(req.session);
  if (req.session.uid) {
    res.send('Welcome back, ' + req.session.uid + '!');
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});

// About page
app.get("/about", function(req, res) {
  res.render("about");
});

// User Profile Route
app.get("/userprofile", async function(req, res) {
  try {
    const sql = "SELECT * FROM user"; // Query to fetch users from the database
    const users = await db.query(sql); // Wait for the query to return results
    console.log('Fetched users:', users); // Debugging to see the fetched data

    // Check if users array is empty or not
    if (users.length === 0) {
      console.log('No users found in the database');
      res.status(404).send('No users found');
      return;
    }

    // Render the user profile page with users data
    res.render("userprofile", { users: users });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching users:', error.message);
    console.error(error.stack);
    res.status(500).send("Database error.");
  }
});

// Dashboard Route
app.get('/dashboard', async function(req, res) {
  if (req.session.loggedIn) {
    try {
      // Query to get the logged-in user's data from the database
      const sql = "SELECT * FROM user WHERE user_id = ?";
      const user = await db.query(sql, [req.session.uid]);

      if (user.length === 0) {
        // If no user found, redirect to login
        return res.redirect('/login');
      }

      // Render the dashboard and pass the user data
      res.render('dashboard', { user: user[0] });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      res.status(500).send("Internal server error.");
    }
  } else {
    res.redirect('/login');
  }
});

// Book a Ride Route
app.get('/book', function(req, res) {
  if (req.session.loggedIn) {
    res.render('book'); // Render the existing 'book.pug' page
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
});

// Booking Confirmation Route
app.get('/bookingConfirmation', function(req, res) {
  if (req.session.loggedIn) {
    // Render the booking confirmation page
    res.render('bookingConfirmation');
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
});

// Handle the Booking Form Submission
app.post('/book', async function(req, res) {
  const { pickup, dropoff } = req.body;

  const sql = `
    INSERT INTO rides (user_id, pickup_location, dropoff_location, cost, comments, driver_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    console.log("Form Data: ", req.body);  // Log form data to check what is being submitted
    // Insert the ride into the database
    await db.query(sql, [req.session.uid, pickup, dropoff, 10, '', null]); // Assuming cost is 10, and comments are empty for now

    // Now, fetch the newly created ride's details
    const rideSql = `
      SELECT * FROM rides WHERE user_id = ? AND pickup_location = ? AND dropoff_location = ?
    `;
    
    const ride = await db.query(rideSql, [req.session.uid, pickup, dropoff]);

    if (ride.length > 0) {
      const driverSql = `
        SELECT * FROM user WHERE user_id = ?
      `;
      const driver = await db.query(driverSql, [1]); // Using dummy driver ID for now

      // After successful booking, render the booking confirmation page
      res.render('bookingConfirmation', {
        ride: ride[0],   // Pass the ride details
        driver: driver[0] // Pass the driver details
      });
    } else {
      res.status(500).send("Error fetching ride details.");
    }

  } catch (error) {
    console.error("Error submitting booking:", error.message);
    console.error(error.stack);  // Log the full error stack
    res.status(500).send("Error submitting booking.");
  }
});

// Login Route (GET)
app.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    return res.redirect('/dashboard'); // If already logged in, redirect to dashboard
  }
  res.render('login'); // Render the login page if not logged in
});

// Authenticate Route (POST)
app.post('/authenticate', async function (req, res) {
  try {
    const params = req.body;
    const email = params.email;
    const password = params.password;

    // Fetch the user by email from the database
    const sql = "SELECT * FROM user WHERE email = ?";
    const users = await db.query(sql, [email]);

    if (users.length === 0) {
      console.log('Invalid email:', email);
      return res.status(401).send('Invalid email');
    }

    const user = users[0];

    // Compare the entered password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Set session on successful login
      req.session.uid = user.user_id;
      req.session.loggedIn = true;
      req.session.firstName = user.firstname;  // Store first name
      req.session.lastName = user.lastname;    // Store last name
      req.session.email = user.email;          // Store email
      req.session.rating = user.rating;        // Store rating
      console.log('Session established for user ID:', user.user_id);
      res.redirect('/dashboard'); // Redirect to dashboard on success
    } else {
      console.log('Invalid password for user:', email);
      res.status(401).send('Invalid password');
    }
  } catch (err) {
    console.error('Error during authentication:', err.message);
    console.error(err.stack);  // Log the full error stack for more insight
    res.status(500).send('Internal server error');
  }
});

// Logout Route
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
});

// User List Route
app.get('/userlist', async function(req, res) {
  if (req.session.loggedIn) {
    try {
      // Query to fetch all users from the database
      const sql = "SELECT * FROM user"; 
      const users = await db.query(sql);

      if (users.length > 0) {
        // Render the user list page with the users data
        res.render('userlist', { users: users });
      } else {
        // If no users found, send a message
        res.render('userlist', { users: [], message: 'No users found' });
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).send("Error fetching users.");
    }
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
});

// Start server on port 3000
app.listen(3000, function(){
  console.log(`Server running at http://127.0.0.1:3000/`);
});
