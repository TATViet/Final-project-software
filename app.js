const express = require("express");

const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require('helmet');
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://TracViet:Vietk12+@atlascluster.3tjpvpi.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', { useNewUrlParser: true, useUnifiedTopology: true });


// use helmet to protech header
app.use(helmet.hsts({
    maxAge: 31536000, // Thời gian sống là 1 năm
    includeSubDomains: true, // Áp dụng cho các subdomains
    preload: true // Cho phép preload vào HSTS
})); //HSTS giúp bảo vệ người dùng khỏi các tấn công man-in-the-middle bằng cách đảm bảo rằng các yêu cầu luôn được gửi qua HTTPS.
app.use(helmet.noSniff());// ngăn chặn trình duyệt xác định kiểu MIME  bảo vệ ứng dụng khỏi tấn công XSS


// Middleware setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({ 
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

// Passport configuration
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/cart"));

// Server setup


app.listen(port, function () {
    console.log("Server Has Started!");
    console.log("http://localhost:3000");
});

