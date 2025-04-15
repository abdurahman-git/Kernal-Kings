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
    res.render("userprofile", { users: users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send("Database error.");
  }
});

// Dashboard Route
app.get('/dashboard', async function(req, res) {
  if (req.session.loggedIn) {
    try {
      const sql = "SELECT * FROM user WHERE user_id = ?";
      const user = await db.query(sql, [req.session.uid]);

      if (user.length === 0) {
        return res.redirect('/login');
      }

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
    res.render('book');
  } else {
    res.redirect('/login');
  }
});

// Handle the Booking Form Submission
app.post('/book', async function(req, res) {
  const { pickup, dropoff } = req.body;

  // Check if pickup and dropoff locations are provided
  if (!pickup || !dropoff) {
    return res.render('book', { error: "Pickup and Dropoff locations are required." });
  }

  const cost = 10; // Default cost or calculate based on parameters (you can adjust this logic)

  const sql = `
    INSERT INTO rides (user_id, pickup_location, dropoff_location, cost, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    // Insert the ride into the database
    await db.query(sql, [req.session.uid, pickup, dropoff, cost, 'pending']);

    // Fetch the newly created ride details
    const rideSql = `
      SELECT * FROM rides WHERE user_id = ? AND pickup_location = ? AND dropoff_location = ?
    `;
    
    const ride = await db.query(rideSql, [req.session.uid, pickup, dropoff]);

    if (ride.length > 0) {
      // Store the ride ID in the session
      req.session.rideId = ride[0].ride_id;

      // Fetch driver details (using dummy driver ID 1 for now)
      const driverSql = `
        SELECT * FROM user WHERE user_id = ?
      `;
      const driver = await db.query(driverSql, [1]);

      // Render booking confirmation page
      res.render('bookingConfirmation', {
        ride: ride[0],  // Pass the ride details (including cost)
        driver: driver[0]  // Pass the driver details
      });
    } else {
      res.status(500).send("Error fetching ride details.");
    }

  } catch (error) {
    console.error("Error submitting booking:", error.message);
    res.status(500).send("Error submitting booking.");
  }
});

// New Review Form Route (GET)
app.get('/reviewNew', function(req, res) {
  if (req.session.loggedIn) {
    res.render('reviewNew');
  } else {
    res.redirect('/login');
  }
});

// Submit Review Route (POST)
app.post('/review/new', async function(req, res) {
  const { review, rating, ride_id } = req.body;

  if (!review || review.trim() === "") {
    return res.render('reviewNew', { error: 'Review cannot be empty.' });
  }

  if (rating < 1 || rating > 5) {
    return res.render('reviewNew', { error: 'Rating must be between 1 and 5.' });
  }

  // Check if ride_id is valid
  if (!ride_id || isNaN(ride_id)) {
    return res.render('reviewNew', { error: 'Ride ID is required.' });
  }

  const sql = `
    INSERT INTO reviews (ride_id, user_id, rating, COMMENT)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [ride_id, req.session.uid, rating, review]);

    // Redirect to reviews page after successful submission
    res.redirect('/reviews');
  } catch (error) {
    console.error("Error submitting review:", error.message);
    res.status(500).send("Error submitting review.");
  }
});

// Reviews Route (GET)
app.get('/reviews', async function(req, res) {
  if (req.session.loggedIn) {
    try {
      const sql = "SELECT * FROM reviews"; 
      const reviews = await db.query(sql);
      res.render('reviews', { reviews: reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      res.status(500).send("Error fetching reviews.");
    }
  } else {
    res.redirect('/login');  // Redirect to login if not logged in
  }
});

// Login Route (GET)
app.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    return res.redirect('/dashboard');
  }
  res.render('login');
});

// Authenticate Route (POST)
app.post('/authenticate', async function (req, res) {
  try {
    const { email, password } = req.body;

    const sql = "SELECT * FROM user WHERE email = ?";
    const users = await db.query(sql, [email]);

    if (users.length === 0) {
      return res.status(401).send('Invalid email');
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.uid = user.user_id;
      req.session.loggedIn = true;
      req.session.firstName = user.firstname;
      req.session.lastName = user.lastname;
      req.session.email = user.email;
      req.session.rating = user.rating;
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (err) {
    console.error('Error during authentication:', err.message);
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
      const sql = "SELECT * FROM user"; 
      const users = await db.query(sql);
      res.render('userlist', { users: users });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).send("Error fetching users.");
    }
  } else {
    res.redirect('/login');
  }
});


// Start server on port 3000
app.listen(3000, function(){
  console.log(`Server running at http://127.0.0.1:3000/`);
});
