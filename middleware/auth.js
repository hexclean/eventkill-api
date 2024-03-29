const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
	// Get token from header
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	// Verify token
	try {
		await jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
			if (error) {
				res.status(401).json({ msg: "Token is not valid" });
			} else {
				req.user = decoded.user;
				next();
			}
		});
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
};
