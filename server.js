// Declare our dependencies
var express = require("express");
var request = require("superagent");

const path = require("path");
// Initialize the app
const app = express();
// Import Body parser
const bodyParser = require("body-parser");
// Setup server port
const port = process.env.PORT || 5000;

var NON_INTERACTIVE_CLIENT_ID = "6KUhnK52n38qpyFsNlvdVD1tE2Tlj4il";
var NON_INTERACTIVE_CLIENT_SECRET = "3NWIuRY8BNA_WU8ebJelhRkYvmeHuRMU1SVxMEfQw6qv0QEDUlLilvZ5TDrMTBZJ";

//an object that we’ll use to exchange our credentials for an access token.
var authData = {
	client_id: NON_INTERACTIVE_CLIENT_ID,
	client_secret: NON_INTERACTIVE_CLIENT_SECRET,
	domain: "mypgguru.auth0.com",
	audience: "http://api.mypgguru.com",
	grant_type: "client_credentials",
};

// We’ll create a middleware to make a request to the oauth/token Auth0 API with our authData we created earlier.
// Our data will be validated and if everything is correct, we’ll get back an access token.
// We’ll store this token in the req.access_token variable and continue the request execution.
// It may be repetitive to call this endpoint each time and not very performant, so you can cache the access_token once it is received.
function getAccessToken(req, res, next) {
	request
		.post("https://mypgguru.auth0.com/oauth/token")
		.send(authData)
		.end(function(err, res) {
			if (res.body.access_token) {
				req.access_token = res.body.access_token;
				next();
			} else {
				console.log(401, "Unauthorized");
			}
		});
}
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Configure bodyparser to handle post requests
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Send message for default URL
app.get("/", (req, res) => res.send("Hello World with Express"));

app.get("/api/pgs", getAccessToken, function(req, res) {
	request
		.get(`http://localhost:8080/api/pgs?pgtype=${req.query.pgtype}&locality=${req.query.locality}`)
		.set("Authorization", "Bearer " + req.access_token)
		.pipe(res);
});

app.get("/api/pgs/locality", getAccessToken, function(req, res) {
	request
		.get(`http://localhost:8080/api/pgs/locality?locality=${req.query.locality}`)
		.set("Authorization", "Bearer " + req.access_token)
		.pipe(res);
});

app.get("/api/pgs/:id", getAccessToken, function(req, res) {
	request
		.get(`http://localhost:8080/api/pgs/${req.params.id}`)
		.set("Authorization", "Bearer " + req.access_token)
		.pipe(res);
});

app.post("/api/newcustomer", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/api/newcustomer`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

app.post("/users/authenticate", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/users/authenticate`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

app.get("/users", getAccessToken, function(req, res) {
	request
		.get(`http://localhost:8080/users`)
		.set("Authorization", "Bearer " + req.access_token)
		.pipe(res);
});

app.get("/users/:id", getAccessToken, function(req, res) {
	request
		.get(`http://localhost:8080/users/${req.params.id}`)
		.set("Authorization", "Bearer " + req.access_token)
		.pipe(res);
});

app.post("/users/register", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/users/register`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

app.post("/api/createFeedback", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/api/createFeedback`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

app.post("/api/createUsersSearchingInfo", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/api/createUsersSearchingInfo`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

app.post("/api/createUsersInterestedInfo", getAccessToken, function(req, res) {
	request
		.post(`http://localhost:8080/api/createUsersInterestedInfo`)
		.set("Authorization", "Bearer " + req.access_token)
		.send(req.body)
		.pipe(res);
});

// Launch app to listen to specified port
app.listen(port, () => console.log(`listening on port: ${port}`));
