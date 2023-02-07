const _ = require("lodash");
const accepts = require("accepts");
const crypto = require("crypto");
const flatten = require("flat");
const bcrypt = require("bcryptjs");
//  const twilio = require("twilio")(global.config.TWILIO.SID, global.config.TWILIO.TOKEN);
//  const enums = require("../json/enums");

const logger = require("./logger");
const { default: jwtDecode } = require("jwt-decode");

//  const geocoder = require("node-geocoder")({
//      provider: "google",
//      httpAdapter: "https",
//      apiKey: global.config.GOOGLE.API.KEY,
//      formatter: null
//  });

/* firebase */
//  const firebaseConfig = require("../config-firebase.json");
//  const firebaseConfigAdmin = require("../service-account-firebase-admin.json");
//  const firebaseAdmin = require("firebase-admin");
//  firebaseAdmin.initializeApp({
//      credential: firebaseAdmin.credential.cert(firebaseConfigAdmin),
//      databaseURL: firebaseConfig.databaseURL
//  });

let functions = {};

functions.config4hashes = {
	// size of the generated hash
	hashBytes: 32,
	// larger salt means hashed passwords are more resistant to rainbow table, but
	// you get diminishing returns pretty fast
	saltBytes: 16,
	// more iterations means an attacker has to take longer to brute force an
	// individual password, so larger is better. however, larger also means longer
	// to hash the password. tune so that hashing the password takes about a
	// second
	iterations: 872791,
};

/* create response-wrapper object */
functions.createResponseObject = ({
	req,
	result = 0,
	message = "",
	payload = {},
	logPayload = false,
}) => {
	let payload2log = {};
	if (logPayload) {
		payload2log = flatten({ ...payload });
	}

	let messageToLog = `RES [${req.requestId}] [${req.method}] ${req.originalUrl}`;
	messageToLog +=
		(!_.isEmpty(message) ? `\n${message}` : "") +
		(!_.isEmpty(payload) && logPayload
			? `\npayload: ${JSON.stringify(payload2log, null, 4)}`
			: "");

	if (result < 0 && (result !== -50 || result !== -51)) {
		logger.error(messageToLog);
	} else if (!_.isEmpty(messageToLog)) {
		logger.info(messageToLog);
	}

	return { result: result, message: message, payload: payload };
};

/* Geocoding - convert address to geocodes */
functions.geocode = async (address) => {
	try {
		const result = await geocoder.geocode(address);
		if (result !== null && result?.length > 0) {
			return {
				latitude: result[0].latitude,
				longitude: result[0].longitude,
			};
		}
		return null;
	} catch (error) {
		logger.error(
			`#geocode - Error encountered while getting the geocodes from address: ${error.message}\n${error.stack}`
		);
		return null;
	}
};

/* Return the language of the logged-in user. If it is not present, get it from the request query parameter. */
functions.getLocale = (req) => {
	const locale = {
		country: "IN",
		lang: "en",
	};

	if (!req) {
		return locale;
	}

	let parts = [];

	if (!_.isEmpty(req.headers["accept-language"])) {
		const accept = accepts(req);
		const languages = accept.languages();
		logger.info("#getLocale - accepted languages: " + languages);

		if (languages) {
			let localeFromRequest = languages[0];
			parts = localeFromRequest.split("_");
			locale.lang = parts[0];
			if (parts.length > 1) {
				locale.country = parts[1].toUpperCase();
			}
		}

		logger.info(
			"#getLocale - (from request headers) " + JSON.stringify(locale)
		);
		if (locale.lang !== "en") {
			locale.lang = "en";
		}
		return locale;
	} else if (
		typeof req.query.locale !== "undefined" &&
		req.query.locale !== null &&
		req.query.locale?.length > 0
	) {
		let localeFromParameter = req.query.locale;
		parts = localeFromParameter.split("_");
		locale.lang = parts[0];
		if (parts.length > 1) {
			locale.country = parts[1];
		}

		logger.info(
			"#getLocale - (from query params) " + JSON.stringify(locale)
		);
		if (locale.lang !== "en") {
			locale.lang = "en";
		}
		return locale;
	} else if (typeof req.user !== "undefined" && req.user !== null) {
		let localeFromUser = req.user.locale;
		if (
			typeof localeFromUser !== "undefined" &&
			localeFromUser !== null &&
			localeFromUser?.length > 0
		) {
			parts = localeFromUser.split("_");
			locale.lang = parts[0];
			if (parts.length > 1) {
				locale.country = parts[1];
			}

			logger.info(
				"#getLocale - (from profile) " + JSON.stringify(locale)
			);
			if (locale.lang !== "en") {
				locale.lang = "en";
			}
			return locale;
		}
	}

	// logger.info("#getLocale - " + JSON.stringify(locale));
	return locale;
};

/* Return true if the app is in production mode */
functions.isLocal = () => process.env.APP_ENVIRONMENT.toLowerCase() === "local";

/* Return true if the app is in production mode */
functions.isProduction = () =>
	process.env.APP_ENVIRONMENT.toLowerCase() === "production" ||
	process.env.APP_ENVIRONMENT.toLowerCase() === "prod";

/* Return true if the app is in production mode */
functions.isTest = () => process.env.APP_ENVIRONMENT.toLowerCase() === "test";

functions.maskName = (name) => {
	let maskedName = "";
	if (name) {
		const nameParts = name.split(/(\s+)/);
		for (let i = 0; i < nameParts.length; i++) {
			if (nameParts[i].trim()?.length > 0) {
				maskedName += nameParts[i].charAt(0) + ". ";
			}
		}
	}
	return maskedName.trim();
};

/* Mask a number - e.g., change 0041123456789 to 0041*****6789 */
functions.maskPhone = (phone) => {
	let maskedPhone = "";
	if (phone) {
		maskedPhone =
			phone.substring(0, 4) +
			phone
				.substring(4, phone.length - 4)
				.replace(new RegExp("[0-9]", "g"), "*") +
			phone.substring(phone.length - 4);
	}
	return maskedPhone;
};

functions.passwordHash = (password) =>
	crypto.createHash("sha256").update(password.toString()).digest("hex");

functions.checkStatus = async (user) => {
	const findRole = await global.models.GLOBAL.ROLE.findOne({
		where: { name: user.type },
		raw: true,
	});
	if (findRole) {
		let status = findRole.isActive === true ? true : false;
		return status;
	}
};
//  Bcrypt hash password
//  functions.passwordHash = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     return hash;
//  };

/* Send SMS */
functions.sendMessage = async (countryCodeToUse, phoneToUse, otpToUse) => {
	// logger.info(
	//   "#sendMessage - parameters: " + JSON.stringify(parameters, null, 3)
	// );
	const otp = otpToUse || "";
	const phone = phoneToUse || "";
	const countryCode = countryCodeToUse || "";
	if (!phone) {
		logger.info(
			"#sendMessage - The phone number cannot be empty. No SMS will be sent out."
		);
		return null;
	}
	let phone4twilio = phone;
	console.log("phone4twilio--->>", phone4twilio.toString().includes("+"));
	if (
		phone4twilio.toString().includes("00") !== 0 &&
		phone4twilio.toString().includes("+") !== 0
	) {
		phone4twilio = countryCode + phone4twilio;
	} else if (phone4twilio.toString().indexOf("00") === 0) {
		phone4twilio = "+" + phone4twilio.slice(2);
	}
	console.log("phone4twilio", phone4twilio);
	const url = "https://sms.anayamail.com/sendsms";
	var dataForSms = qs.stringify({
		token: process.env.TOKEN,
		number: phone4twilio,
		message: `Thank you for connecting with MyTeam11. Your OTP is: ${otp} 9HCAFRqi6kt`,
		msg_type: "normal",
		senderid: "MYTEAM",
		callback_url: process.env.CALLBACK_URL,
	});
	//   console.log("token",process.env.TOKEN);
	//   console.log("callback",process.env.CALLBACK_URL);
	// console.log("datafomrs", data);
	var config = {
		method: "post",
		url: "https://trans11.vectorapi.com/send_sms",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data: dataForSms,
	};
	try {
		const resp = await axios(config)
			.then(function (response) {
				console.log("Responseeee", response);
				console.log("Responseeee", JSON.stringify(response.data));
				if (parseInt(response.status / 100) === 2) {
					logger.info(
						"#sendMessage - Message sent to " +
							phone4twilio +
							" successfully."
					);
					return response.data;
				}
			})
			.catch(function (error) {
				console.log("ERROR", error);
				logger.error(
					"#sendMessage - Message sending failed to " +
						phone4twilio +
						". Reason: n.a."
				);
				return null;
			});
		console.log("resp", resp);
		return resp;
		// if (!messageDetails) {
		//     logger.error("#sendMessage - Message sending failed to " + phone4twilio + ". Reason: n.a.");
		//     return null;
		// } else if (messageDetails.errorCode !== null) {
		//     logger.error("#sendMessage - Message sending failed to " + phone4twilio + ". result: " + JSON.stringify(messageDetails));
		//     return null;
		// } else {
		//     messageDetails.countryCode = phoneDetails.countryCode;
		//     logger.info("#sendMessage - Message sent to " + phone4twilio + " on " + messageDetails.dateCreated);
		//     return messageDetails;
		// }
	} catch (error) {
		logger.error(
			"#sendMessage - Message sending failed to " +
				phone4twilio +
				". Reason: " +
				error
		);
		return null;
	}
};

/** Sort a JSON by keys */
functions.sortByKeys = (obj) => {
	if (_.isEmpty(obj)) {
		return obj;
	}

	const sortedObj = {};
	Object.keys(obj)
		.sort()
		.forEach((key) => {
			sortedObj[key] = obj[key];
		});

	return sortedObj;
};

functions.validateEmail = (email) => {
	if (_.isEmpty(email)) {
		return false;
	}
	const regex = new RegExp(
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
	);
	return regex.test(email);
};

/** Validate a phone number */
functions.validatePhoneNumber = async (phone4twilio) => {
	if (_.isEmpty(phone4twilio)) {
		return null;
	} else {
		if (
			phone4twilio.indexOf("00") !== 0 &&
			phone4twilio.indexOf("+") !== 0
		) {
			phone4twilio = "+" + phone4twilio;
		} else if (phone4twilio.indexOf("00") === 0) {
			phone4twilio = "+" + phone4twilio.slice(2);
		}

		try {
			const phoneDetails = await twilio.lookups
				.phoneNumbers(phone4twilio)
				.fetch();
			if (phoneDetails) {
				logger.info(
					"#validatePhoneNumber - phoneDetails: " +
						JSON.stringify(phoneDetails, null, 4)
				);
				return phoneDetails;
			}
		} catch (error) {
			logger.error(
				`#validatePhoneNumber - Error encountered while validating phone number: ${error.message} \n${error.stack}`
			);
			return null;
		}
	}
};

functions.getHeaderFromToken = async (token) => {
	try {
		const decodedToken = await jwtDecode(token, {
			complete: true,
		});
		return decodedToken ? decodedToken : null;
	} catch (error) {
		logger.error(
			`#getHeaderFromToken - Error encountered while getting header from token: ${error.message} \n${error.stack}`
		);
		return null;
	}
};

functions.generateReferalCode = (codeLength = 8) => {
	const alphaToInclude =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
	let referralCode = "";
	for (let i = 0; i < codeLength; i++) {
		referralCode +=
			alphaToInclude[Math.floor(Math.random() * alphaToInclude.length)];
	}
	return referralCode;
};

/* This has to be the last line - add all functions above. */
module.exports = exports = functions;
