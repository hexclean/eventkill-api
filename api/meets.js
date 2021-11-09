const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require("lodash");
// Models
const User = require("../models/User");
const Meets = require("../models/Meets");
const Status = require("../models/Status");
const StatusTranslations = require("../models/StatusTranslations");
const Partner = require("../models/Partner");

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

// @route    GET api/meets/today
// @desc     Get all today meets
// @access   Private
router.get("/today", isAuth, async (req, res) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const meetsPartner = await Partner.findAll({
    where: {
      userId: req.user.id,
      statusId: 1,
      startDate: {
        [Op.gt]: TODAY_START,
      },
    },
    order: [["startDate", "ASC"]],
    include: [{ model: Meets, include: [{ model: User }] }],
  });

  const resultPartnerColumn = meetsPartner.map((meet) => {
    return {
      id: meet.Meet.id,
      startDate: meet.Meet.startDate.toISOString().split("T")[0],
      status: meet.Meet.statusId,
      meets: [
        {
          title: meet.Meet.title,
          description: meet.Meet.description,
          startTime: meet.Meet.startTime,
          endTime: meet.Meet.endTime,
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

  const meetsCreator = await Meets.findAll({
    where: {
      userId: req.user.id,
      statusId: 1,
      startDate: {
        [Op.gt]: TODAY_START,
      },
    },
    order: [["startDate", "ASC"]],
    include: [{ model: Partner, include: [{ model: User }] }],
  });
  // console.log(meetsCreator[0].createdAt);
  // console.log(meetsCreator[0].startDate);

  const resultCreatorColumn = meetsCreator.map((meet) => {
    return {
      id: meet.id,
      startDate: meet.startDate.toISOString().split("T")[0],
      meets: [
        {
          title: meet.title,
          description: meet.description,
          startTime: meet.startTime,
          endTime: meet.endTime,
        },
      ],
      partner: [
        {
          name: meet.Partners[0].User.name,
          email: meet.Partners[0].User.email,
          company: meet.Partners[0].User.company,
        },
      ],
    };
  });

  var result = _.unionBy(resultPartnerColumn, resultCreatorColumn);

  return res.json({
    status: 200,
    msg: "Pending meets",
    result: result,
  });
});

// @route    GET api/meets/pending
// @desc     Get all pending meets
// @access   Private
router.get("/pending", isAuth, async (req, res) => {
  try {
    const meets = await Partner.findAll({
      where: {
        userId: req.user.id,
        statusId: 3,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.Meet.id,
        startDate: meet.Meet.startDate.toISOString().split("T")[0],
        status: meet.Meet.statusId,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            startTime: meet.Meet.startTime,
            endTime: meet.Meet.endTime,
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
      msg: "Pending meets",
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

// @route    GET api/meets/pending
// @desc     Get all accepted meets
// @access   Private
router.get("/accepted", isAuth, async (req, res) => {
  try {
    const meetsPartner = await Partner.findAll({
      where: {
        userId: req.user.id,
        statusId: 1,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const resultPartnerColumn = meetsPartner.map((meet) => {
      return {
        id: meet.Meet.id,
        startDate: meet.Meet.startDate.toISOString().split("T")[0],
        status: meet.Meet.statusId,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            startTime: meet.Meet.startTime,
            endTime: meet.Meet.endTime,
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

    const meetsCreator = await Meets.findAll({
      where: {
        userId: req.user.id,
        statusId: 1,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Partner, include: [{ model: User }] }],
    });

    const resultCreatorColumn = meetsCreator.map((meet) => {
      return {
        id: meet.id,
        startDate: meet.startDate.toISOString().split("T")[0],
        meets: [
          {
            title: meet.title,
            description: meet.description,
            startTime: meet.startTime,
            endTime: meet.endTime,
          },
        ],
        partner: [
          {
            name: meet.Partners[0].User.name,
            email: meet.Partners[0].User.email,
            company: meet.Partners[0].User.company,
          },
        ],
      };
    });

    var result = _.unionBy(resultPartnerColumn, resultCreatorColumn);

    return res.json({
      status: 200,
      msg: "Accepted meets",
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

// @route    GET api/meets/deleted
// @desc     Get all declined meets
// @access   Private
router.get("/deleted", isAuth, async (req, res) => {
  try {
    const meetsPartner = await Partner.findAll({
      where: {
        userId: req.user.id,
        statusId: 4,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const resultPartnerColumn = meetsPartner.map((meet) => {
      return {
        id: meet.Meet.id,
        startDate: meet.Meet.startDate.toISOString().split("T")[0],
        status: meet.Meet.statusId,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            startTime: meet.Meet.startTime,
            endTime: meet.Meet.endTime,
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

    const meetsCreator = await Meets.findAll({
      where: {
        userId: req.user.id,
        statusId: 4,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Partner, include: [{ model: User }] }],
    });

    const resultCreatorColumn = meetsCreator.map((meet) => {
      return {
        id: meet.id,
        startDate: meet.startDate.toISOString().split("T")[0],
        meets: [
          {
            title: meet.title,
            description: meet.description,
            startTime: meet.startTime,
            endTime: meet.endTime,
          },
        ],
        partner: [
          {
            name: meet.Partners[0].User.name,
            email: meet.Partners[0].User.email,
            company: meet.Partners[0].User.company,
          },
        ],
      };
    });

    var result = _.unionBy(resultPartnerColumn, resultCreatorColumn);

    return res.json({
      status: 200,
      msg: "Deleted meets",
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

// @route    GET api/meets/calendar
// @desc     Get all meets
// @access   Private
router.get("/calendar", isAuth, async (req, res) => {
  try {
    const meetsPartner = await Partner.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Meets, include: [{ model: User }] }],
    });

    const resultPartnerColumn = meetsPartner.map((meet) => {
      return {
        id: meet.Meet.id,
        startDate: meet.Meet.startDate,
        formattedStartDate: meet.Meet.startDate.toISOString().split("T")[0],
        status: meet.statusId,
        meets: [
          {
            title: meet.Meet.title,
            description: meet.Meet.description,
            startTime: meet.Meet.startTime,
            endTime: meet.Meet.endTime,
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

    const meetsCreator = await Meets.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Partner, include: [{ model: User }] }],
    });

    const resultCreatorColumn = meetsCreator.map((meet) => {
      return {
        id: meet.id,
        startDate: meet.startDate,
        formattedStartDate: meet.startDate.toISOString().split("T")[0],
        status: meet.statusId,
        meets: [
          {
            title: meet.title,
            description: meet.description,
            startTime: meet.startTime,
            endTime: meet.endTime,
          },
        ],
        partner: [
          {
            name: meet.Partners[0].User.name,
            email: meet.Partners[0].User.email,
            company: meet.Partners[0].User.company,
          },
        ],
      };
    });

    const merged = _.unionBy(resultPartnerColumn, resultCreatorColumn);

    const result = merged.reduce(function (r, a) {
      r[a.startDate.toISOString().slice(0, 10)] =
        r[a.startDate.toISOString().slice(0, 10)] || [];
      r[a.startDate.toISOString().slice(0, 10)].push(a);
      return r;
    }, Object.create(null));

    return res.json({
      status: 200,
      msg: "Calendar meets",
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

// @route    POST api/meets/create
// @desc     Create a meet
// @access   Private
router.post("/create", isAuth, async (req, res) => {
  try {
    const { title, user, description, date, startTime, endTime, email } =
      req.body;

    console.log("user", user);
    console.log("user length is", user.length);
    // if (email.length === 0) {
    //   const meet = await Meets.create({
    //     title,
    //     description,
    //     userId: req.user.id,
    //     statusId: 3,
    //     startTime,
    //     endTime,
    //     startDate: date,
    //   });

    //   await Partner.create({
    //     statusId: 3,
    //     userId: user,
    //     meetId: meet.id,
    //     startDate: date,
    //   });
    // }

    // if (user != 0) {
    //   const meet = await Meets.create({
    //     title,
    //     description,
    //     userId: req.user.id,
    //     statusId: 3,
    //     startTime,
    //     endTime,
    //     startDate: date,
    //   });

    //   await Partner.create({
    //     statusId: 3,
    //     userId: user,
    //     meetId: meet.id,
    //     startDate: date,
    //   });
    // }

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

// @route    GET api/meets/check/:id
// @desc     Check meet status
// @access   Private
router.get("/check/:id", isAuth, async (req, res) => {
  try {
    // const meet = await Partner.fin({
    //   where: { meetId: req.params.id, userId: { [Op.ne]: req.user.id } },
    // });

    const partnerStatus = await Partner.findOne({
      where: { meetId: req.params.id },
    });
    const creatorStatus = await Meets.findByPk(req.params.id);

    // const result = meet.map((meet) => {
    //   return {
    //     id: meet.id,
    //     status: meet.status,
    //   };
    // });

    return res.json({
      status: 200,
      msg: "Check meet",
      result: {
        id: partnerStatus.meetId,
        partnerStatus: partnerStatus.statusId,
        creatorStatus: creatorStatus.statusId,
      },
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

// @route    GET api/meets/sent
// @desc     Get all created meets
// @access   Private
router.get("/sent", isAuth, async (req, res) => {
  try {
    const meets = await Meets.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["startDate", "ASC"]],
      include: [{ model: Partner, include: [{ model: User }] }],
    });

    const result = meets.map((meet) => {
      return {
        id: meet.id,
        startDate: meet.startDate.toISOString().split("T")[0],
        status: meet.statusId,
        meets: [
          {
            title: meet.title,
            description: meet.description,
            startTime: meet.startTime,
            endTime: meet.endTime,
          },
        ],
        partner: [
          {
            name: meet.Partners[0].User.name,
            email: meet.Partners[0].User.email,
            company: meet.Partners[0].User.company,
          },
        ],
      };
    });

    return res.json({
      status: 200,
      msg: "Created meets",
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
