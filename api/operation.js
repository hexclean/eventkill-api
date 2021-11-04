const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");

// Models
const Meets = require("../models/Meets");
const Partner = require("../models/Partner");

//! const mailgun = require("mailgun-js");
//! const DOMAIN = "mg.foodnet.ro";
//! const api_key = "339804bc04a75f14fe62d0f13c85e08b";
//! const mg = mailgun({
//! 	apiKey: api_key,
//! 	domain: DOMAIN,
//! 	host: "api.eu.mailgun.net",
//! });

// @route    POST api/operation/accept
// @desc     Accept a meet
// @access   Private
router.post("/accept/:id", isAuth, async (req, res) => {
  const meetId = req.params.id;

  if (meetId == undefined) {
    return res.json({
      status: 400,
      msg: "Id is empty",
      result: [],
    });
  }

  try {
    await Partner.update(
      {
        statusId: 1,
      },
      { where: { meetId: meetId, userId: req.user.id } }
    );

    await Meets.update(
      {
        statusId: 1,
      },
      { where: { id: meetId, userId: req.user.id } }
    );

    return res.json({
      status: 200,
      msg: "Successfully accepted",
      result: [],
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

// @route    POST api/operation/delete/:id
// @desc     User decline an accepted invitation
// @access   Private
router.post("/delete/:id", isAuth, async (req, res) => {
  const meetId = req.params.id;

  if (meetId == undefined) {
    return res.json({
      status: 400,
      msg: "Id is empty",
      result: [],
    });
  }

  const partnerDecline = await Partner.findOne({
    where: {
      userId: req.user.id,
      meetId: meetId,
    },
  });

  const creatorDecline = await Meets.findOne({
    where: {
      userId: req.user.id,
      id: meetId,
    },
  });

  try {
    if (creatorDecline === null) {
      await Partner.update(
        {
          statusId: 4,
        },
        { where: { meetId: meetId, userId: req.user.id } }
      );
    }

    if (partnerDecline === null) {
      await Meets.update(
        {
          statusId: 4,
        },
        { where: { id: meetId, userId: req.user.id } }
      );
    }
    return res.json({
      status: 200,
      msg: "Successfully deleted",
      result: [],
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
