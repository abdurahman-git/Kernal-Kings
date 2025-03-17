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


//user profile page
app.get("/userprofile", function(req, res) {
res.render("userprofile");
});

//listing page
app.get("/listing", function(req, res) {
res.render("listing");
});

//detail page
app.get("/detail", function(req, res) {
res.render("detail");
});

//route to reviews page
app.get("/reviews", function(req, res) {
res.render("reviews");
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
// Retrieve the 'name' parameter and use it in a dynamically generated page
res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
console.log(`Server running at http://127.0.0.1:3000/`);
});
