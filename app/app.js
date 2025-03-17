// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// About us Route
app.get('/about-us', (req, res) => {
    res.render('about-us'); 
});
// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});
//about page
app.get("/about", function(req, res) {
    res.render("about");
});
//user list page
// User list page (pulling from database)
app.get("/userlist", async function(req, res) {
    try {
        const sql = "SELECT * FROM user";
        const users = await db.query(sql);
        console.log(users); // Debugging to see the result
        res.render("userlist", { users: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Database error.");
    }
});


// User profile page
app.get("/userprofile", async function(req, res) {
    try {
        const sql = "SELECT * FROM user";  // Query to fetch users from the database
        const users = await db.query(sql); // Wait for the query to return results
        console.log(users);  // Debugging to see the result

        // Render the user profile page with users data
        res.render("userprofile", { users: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Database error.");
    }
});


//listing page
app.get("/listing", async function(req, res) {
    try {
        const sql = `
            SELECT rides.pickup_location, rides.dropoff_location, rides.cost, 
                   user.firstname AS user_firstname, user.lastname AS user_lastname, 
                   user.email AS user_email, user.rating AS user_rating
            FROM rides
            JOIN user ON rides.user_id = user.user_id
        `;
        const rides = await db.query(sql);
        console.log(rides); // Debugging purposes
        res.render("listing", { rides: rides });
    } catch (error) {
        console.error("Error fetching ride listings:", error);
        res.status(500).send("Database error.");
    }
});


app.get("/detail", async function(req, res) {
    try {
        const sql = `
            SELECT r.*, u.firstname as user_firstname, u.lastname as user_lastname, 
                   u.email as user_email, u.rating as user_rating
            FROM rides r
            JOIN user u ON r.user_id = u.user_id
        `;  // This query will fetch all the rides and their associated user details.

        const rides = await db.query(sql);  // Execute the query to fetch the data

        if (rides.length === 0) {
            return res.status(404).send("No rides found.");
        }

        // Pass the rides data to the template
        res.render("detail", { rides: rides });

    } catch (error) {
        console.error("Error fetching ride details:", error);
        res.status(500).send("Database error.");
    }
});


// Route to display all reviews
// Route to display all reviews
app.get("/reviews", async function(req, res) {
    try {
        const sql = "SELECT * FROM reviews";  // Query to fetch all reviews
        const reviews = await db.query(sql); // Execute the query and fetch reviews

        console.log(reviews);  // Debugging to see the result

        // Render the reviews page and pass the reviews data
        res.render("reviews", { reviews: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Database error.");
    }
});







// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});


