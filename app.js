const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app); // Tạo server từ Express
const io = socketIo(server); // Khởi tạo Socket.IO

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Tối đa 100 yêu cầu trong 15 phút
    keyGenerator: (req) => {
      return req.headers['x-user-id'] || 'default'; // Lấy ID người dùng từ header
    },
    message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.',
    handler: (req, res) => {
      res.status(429).send('Bạn đã vượt quá giới hạn yêu cầu!');
    }
});

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Người dùng đã đăng nhập, cho phép truy cập
    }
    res.redirect('/login'); // Chuyển hướng đến trang đăng nhập
}

// Connect to MongoDB
mongoose.connect('mongodb+srv://TracViet:Vietk12+@atlascluster.3tjpvpi.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', { useNewUrlParser: true, useUnifiedTopology: true });

// use helmet to protech header
app.use(helmet.hsts({
    maxAge: 31536000, // Thời gian sống là 1 năm
    includeSubDomains: true, // Áp dụng cho các subdomains
    preload: true // Cho phép preload vào HSTS
})); //HSTS giúp bảo vệ người dùng khỏi các tấn công man-in-the-middle bằng cách đảm bảo rằng các yêu cầu luôn được gửi qua HTTPS.
app.use(helmet.noSniff());// ngăn chặn trình duyệt xác định kiểu MIME bảo vệ ứng dụng khỏi tấn công XSS
app.use(helmet.frameguard({ action: 'deny' }));//ngăn trang web khác nhúng vào (clickjacking)
// Sử dụng middleware cho tất cả các yêu cầu
app.use(limiter);

// Middleware setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));

// Thiết lập sự kiện socket
app.get("/chat", function (req, res) {
  res.render("chat");
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
  });
});

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
server.listen(port, function () {
    console.log("Server Has Started!");
    console.log("http://localhost:3000");
});
