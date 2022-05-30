const _http = require("http");
const mongoose = require("mongoose");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");


global.returnResponse = function (req, res, promise) {
	res.type("application/json");
	promise.then(result => {
		if (res.finished) return;
		res.status(200);
		res.json(result);
	}).catch(err => {
		if (res.finished) return;
		res.status(err.statusCode || 500);
		res.json(err.stack || err.message || err);
	});
};

const DB_URL = "mongodb+srv://Tier1:Nova$123@alpha.ijh1y.mongodb.net/QUIZ?retryWrites=true&w=majority";

var app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(compression());

/*Helmet helps to secure Express apps by setting various HTTP headers*/
app.use(helmet());
app.set("etag", false);

//enable CORS
app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.append('Access-Control-Allow-Headers', 'Content-Type,debugger-ref');
	next();
});

/*To avoid the application on crash during UnCaught Exception Occurs*/
process.on("uncaughtException", function (error) {
	console.error("UncaughtException ==> ", error);
});

var router = express.Router();

router.get("/healthCheck", function (req, res) {
	res.status(200);
	res.type("application/json");
	res.json("Service is up and running !!!");
});

app.use("/", router);

const { UserController } = require('./dbaccess/controller/UserController.js');
app.use("/serviceEngine/users", UserController.init(express));

var inititateServer = function () {
	var httpOrHttps = httpOrHttps = _http.Server(app);
	var server = httpOrHttps.listen(process.env.PORT || 3000);
	server.timeout = Number(process.env.SERVER_TIMEOUT || 600000); //MilliSeconds. Default=10 Minutes 
	console.log("Server Timeout : " + server.timeout);
	console.log("Server running in port : " + (process.env.PORT || 3000));
	console.error("********* Application Started Successfully with HTTP");
};

var connectToDB = function () {
	mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.error("********* DB Connection successful");
	})
	.catch((error) => {
		console.error(error)
	})
};

inititateServer();
connectToDB();