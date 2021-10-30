const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Partners = require("../models/Partners");
const Invitation = require("../models/Invitation");
const isAuth = require("../middleware/auth");
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
  "/edit-name",
  isAuth,
  [check("name", "Password is required").isLength({ min: 0, max: 30 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid credentials",
        result: [],
      });
    }

    const { name } = req.body;

    try {
      await User.update(
        {
          name,
        },
        { where: { id: req.user.id } }
      );
      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
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
  "/edit-company",
  isAuth,
  [check("name", "Password is required").isLength({ min: 0, max: 30 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid credentials",
        result: [],
      });
    }

    const { company } = req.body;

    try {
      await User.update(
        {
          company,
        },
        { where: { id: req.user.id } }
      );
      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
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

router.get("/", isAuth, async (req, res) => {
  try {
    const data = await User.findByPk(req.user.id);

    let result = {
      id: data.id,
      name: data.name,
      company: data.company,
    };

    return res.json({
      status: 200,
      msg: "Success",
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: 500,
      msg: "Server error",
      result: [],
    });
  }
});

// @route    POST api/auth/login
// @desc     Authenticate admin & get token
// @access   Public
router.post(
  "/invitation",
  isAuth,
  [check("email", "Password is required").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Invalid credentials",
        result: [],
      });
    }

    const { email } = req.body;

    try {
      const partner = await User.findOne({
        where: {
          email,
        },
      });

      if (!partner || partner.id === req.user.id) {
        return res.json({
          status: 404,
          msg: "Partner not found",
          result: [],
        });
      }
      const invitation = await Invitation.create({
        userId: req.user.id,
        generatedCode: 12,
        status: 0,
      });

      await Partners.create({
        userId: partner.id,
        invitationId: invitation.id,
      });

      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
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

// @route    POST api/auth/login
// @desc     Authenticate admin & get token
// @access   Public
router.post("/delete-account", isAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.json({
        status: 400,
        msg: "Account already deleted",
        result: [],
      });
    }
    await User.destroy({
      where: {
        id: req.user.id,
      },
    });

    return res.json({
      status: 200,
      msg: "Account deleted",
      result: [],
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: 500,
      msg: "Server error",
      result: [],
    });
  }
});

module.exports = router;
