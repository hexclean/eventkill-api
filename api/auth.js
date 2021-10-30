const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
// const mailgun = require("mailgun-js");
// const DOMAIN = "mg.foodnet.ro";
// const api_key = "339804bc04a75f14fe62d0f13c85e08b";
// const mg = mailgun({
// 	apiKey: api_key,
// 	domain: DOMAIN,
// 	host: "api.eu.mailgun.net",
// });

// @route    POST api/auth/login
// @desc     Authenticate admin & get token
// @access   Public
router.post(
  "/login",
  [
    check("email", "This is not email format").isEmail(),
    check("password", "Password is required").isLength({ min: 6, max: 30 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid credentials",
        result: [],
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({
        where: { email: email, enabled: 1 },
      });

      if (!user) {
        return res.json({
          status: 400,
          msg: "User or password incorrect || User is suspended",
          result: [],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch || !user) {
        return res.json({
          status: 400,
          msg: "User or password incorrect",
          result: [],
        });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          company: user.company,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "30 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            status: 200,
            msg: "Login success",
            result: [{ token: token, name: user.name }],
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.json({
        status: 500,
        msg: "Server error",
        result: [],
      });
    }
  }
);

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  "/register",
  [
    check("email", "This is not email format").isEmail(),
    check("password", "Password is required").isLength({ min: 6, max: 30 }),
    check("name", "Name is required").isLength({ min: 2, max: 50 }),
    check("company", "Company is required").isLength({ min: 1, max: 50 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid credentials",
        result: [],
      });
    }

    const { email, password, name, company, deviceToken } = req.body;

    try {
      let user = await User.findOne({ where: { email: email } });

      if (user) {
        return res.json({
          status: 400,
          msg: "User already exist",
          result: [],
        });
      }

      let username = name;
      username = username.replace(/\s+/g, "").toLowerCase();

      user = new User({
        email,
        password,
        name,
        company,
        enabled: 1,
        roleId: 1,
        deviceToken,
        username,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            status: 200,
            msg: "'Registration success",
            result: [{ token, name }],
          });
        }
      );
    } catch (err) {
      console.log(err);
      return res.json({
        status: 500,
        msg: "Server error",
        result: [],
      });
    }
  }
);

module.exports = router;
