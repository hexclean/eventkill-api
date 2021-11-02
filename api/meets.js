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
const CancelledMeets = require("../models/CancelledMeets");

//! const mailgun = require("mailgun-js");
//! const DOMAIN = "mg.foodnet.ro";
//! const api_key = "339804bc04a75f14fe62d0f13c85e08b";
//! const mg = mailgun({
//! 	apiKey: api_key,
//! 	domain: DOMAIN,
//! 	host: "api.eu.mailgun.net",
//! });

router.get("/people", isAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.user.id },
        // status: 10,
      },
    });

    const result = users.map((usr) => {
      return {
        id: usr.id,
        name: usr.name + " - " + usr.company,
      };
    });
    console.log(result);
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

router.get("/people/:name", isAuth, async (req, res) => {
  let searchedUser = req.params.name;
  let result;
  try {
    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${req.params.name}%`,
        },
        id: { [Op.ne]: req.user.id },
      },
    });

    result = users.map((usr) => {
      return {
        id: usr.id,
        name: usr.name + " - " + usr.company,
      };
    });

    // if (searchedUser.length < 2) {
    // 	result = {};
    // }

    // console.log(result);

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

// @route    POST api/meets/today
// @desc     Get all today meets
// @access   Private
router.get("/today", isAuth, async (req, res) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();

  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: {
          [Op.like]: `%${req.user.id}%`,
        },
        status: 3,
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },

      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().split("T")[0],
        status: meet.status,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });

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

// @route    POST api/meets/pending
// @desc     Get all pending meets
// @access   Private
router.get("/pending", isAuth, async (req, res) => {
  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: req.user.id,
        mine: 0,
        status: 0,
      },
      order: [["startDate", "ASC"]],

      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().split("T")[0],
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });

    return res.json({
      status: 200,
      msg: "Pending meet list",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 200,
      msg: "Server error",
      result: [],
    });
  }
});

// @route    POST api/meets/pending
// @desc     Get all pending meets
// @access   Private
router.get("/accepted", isAuth, async (req, res) => {
  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: req.user.id,
        // mine: 0,
        accepted: 1,
        status: 3,
      },
      order: [["startDate", "ASC"]],
      include: [
        {
          model: Meets,
          include: [{ model: User }],
        },
      ],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().split("T")[0],
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });

    return res.json({
      status: 200,
      msg: "Pending meet list",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 200,
      msg: "Server error",
      result: [],
    });
  }
});

// @route    POST api/meets/declined
// @desc     Get all pending meets
// @access   Private
router.get("/declined", isAuth, async (req, res) => {
  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: req.user.id,
        // mine: 0,
        status: 1,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().split("T")[0],
        // declinedAt: meet.updatedAt.toISOString().split("T")[0],
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });

    return res.json({
      status: 200,
      msg: "Pending meet list",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 200,
      msg: "Server error",
      result: [],
    });
  }
});

// @route    POST api/meets/calendar
// @desc     Get all meets
// @access   Private
router.get("/calendar", isAuth, async (req, res) => {
  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: req.user.id,
      },

      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const resultFormat = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().slice(0, 10),
        startDate: meet.Meet.startDate,
        status: meet.status,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });
    console.log(resultFormat);

    const result = resultFormat.reduce(function (r, a) {
      r[a.startDate.toISOString().slice(0, 10)] =
        r[a.startDate.toISOString().slice(0, 10)] || [];
      r[a.startDate.toISOString().slice(0, 10)].push(a);
      return r;
    }, Object.create(null));

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

// @route    POST api/meets/calendar
// @desc     Get all meets
// @access   Private
router.post("/create", isAuth, async (req, res) => {
  try {
    const { title, user, description, date, startTime, endTime } = req.body;
    console.log(user);
    const meet = await Meets.create({
      title,
      description,
      userId: req.user.id,
      statusId: 3,
      time: startTime + " - " + endTime,
      startDate: date,
    });

    await CancelledMeets.create({
      status: 0,
      userId: req.user.id,
      meetId: meet.id,
      mine: 1,
      accepted: 0,
      startDate: date,
    });

    await CancelledMeets.create({
      status: 0,
      userId: user,
      meetId: meet.id,
      mine: 0,
      accepted: 0,
      startDate: date,
    });

    return res.json({
      status: 200,
      msg: "Meet created",
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

// @route    POST api/meets/calendar
// @desc     Get all meets
// @access   Private
router.get("/check/:id", isAuth, async (req, res) => {
  try {
    const meet = await CancelledMeets.findAll({
      where: { meetId: req.params.id, userId: { [Op.ne]: req.user.id } },
    });

    const result = meet.map((meet) => {
      return {
        id: meet.id,
        status: meet.status,
      };
    });

    return res.json({
      status: 200,
      msg: "Meet created",
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

// @route    POST api/meets/pending
// @desc     Get all pending meets
// @access   Private
router.get("/sent", isAuth, async (req, res) => {
  try {
    const meets = await CancelledMeets.findAll({
      where: {
        userId: req.user.id,
        mine: 1,
      },
      order: [["createdAt", "DESC"]],

      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.meetId,
        createdAt: meet.createdAt.toISOString().split("T")[0],
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            time: meet.Meet.time,
            startDate: meet.Meet.startDate.toISOString().slice(0, 10),
          },
        ],
        partner: [
          {
            name: meet.Meet.User.name,
            email: meet.Meet.User.email,
            company: meet.Meet.User.company,
          },
        ],
      };
    });

    return res.json({
      status: 200,
      msg: "Pending meet list",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 200,
      msg: "Server error",
      result: [],
    });
  }
});

module.exports = router;
