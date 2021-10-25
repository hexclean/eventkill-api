const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Models
const Meets = require("../models/Meets");
const CancelledMeets = require("../models/CancelledMeets");

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

	const meet = await CancelledMeets.findOne({
		where: { userId: { [Op.ne]: req.user.id }, id: meetId },
	});

	// if (meet.status === 1) {
	// 	return res.json({
	// 		status: 401,
	// 		msg: "Your partner declined this meet",
	// 		result: [],
	// 	});
	// }

	try {
		await CancelledMeets.update(
			{
				status: 3,
				accepted: 1,
			},
			{ where: { meetId: meetId } }
		);

		// await CancelledMeets.create({
		// 	userId: req.user.id,
		// 	status: 0,
		// 	meetId: req.params.id,
		// });

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

// @route    POST api/operation/decline
// @desc     Decline a meet
// @access   Private
router.post("/decline/:id", isAuth, async (req, res) => {
	const meetId = req.params.id;

	if (meetId == undefined) {
		return res.json({
			status: 400,
			msg: "Id is empty",
			result: [],
		});
	}

	const meet = await Meets.findOne({
		where: { userId: req.user.id, id: meetId },
	});

	if (!meet) {
		return res.json({
			status: 400,
			msg: "Only your meet can decline",
			result: [],
		});
	}

	try {
		await Meets.update(
			{
				statusId: 5,
			},
			{ where: { id: meetId } }
		);

		return res.json({
			status: 200,
			msg: "Successfully declined",
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

// @route    POST api/operation/delete
// @desc     User decline an accepted invitation
// @access   Private
router.post("/delete/:id", isAuth, async (req, res) => {
	if (req.params.id == undefined) {
		return res.json({
			status: 400,
			msg: "Id is empty",
			result: [],
		});
	}
	console.log(req.params.id);

	try {
		await CancelledMeets.update(
			{
				status: 1,
			},
			{ where: { meetId: req.params.id, userId: req.user.id } }
		);

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
