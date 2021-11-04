const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Models
const User = require("../models/User");
const Meets = require("../models/Meets");
const Status = require("../models/Status");
const StatusTranslations = require("../models/StatusTranslations");
// const CancelledMeets = require("../models/");

//! const mailgun = require("mailgun-js");
//! const DOMAIN = "mg.foodnet.ro";
//! const api_key = "339804bc04a75f14fe62d0f13c85e08b";
//! const mg = mailgun({
//! 	apiKey: api_key,
//! 	domain: DOMAIN,
//! 	host: "api.eu.mailgun.net",
//! });

router.post("/new-meet", isAuth, async (req, res) => {
  try {
    const users = await User.findByPk(req.user.id);

    const result = users.map((usr) => {
      return {
        id: usr.id,
        name: usr.name + " - " + usr.company,
      };
    });

    console.log(result.length);
    return res.json({
      status: 200,
      msg: "Today meet list",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      msg: "Server error",
      result: [],
    });
  }
});

module.exports = router;
