const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Showing register form
router.get("/register", function (req, res) {
    res.render("register");
});

// Handling user signup
router.post("/register", async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        IsAD: req.body.IsAD == 'on'
    });
    return res.redirect('/login');
});

// Showing login form
router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", async function(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const result = req.body.password === user.password;
            if (result) {
                req.login(user, function(err) {
                    if (err) {
                        return res.status(400).json({ error: "Error logging in" });
                    }
                    res.redirect(user.IsAD ? "/verysecret" : "/productDetails");
                });
            } else {
                
                res.render("login", { alert: "Sai mật khẩu. Vui lòng thử lại." });
            }
        } else {
            res.render("login", { alert: "Tài khoản không có. Vui lòng thử lại." });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});


// Route để đăng xuất
router.get('/logout', (req, res) => {
    req.logout((err) => { // Xóa thông tin đăng nhập
        if (err) {
            return next(err); // Nếu có lỗi xảy ra
        }
        res.redirect('/'); // Chuyển hướng đến trang đăng nhập sau khi logout
    });
});

module.exports = router;
