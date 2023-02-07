const flatten = require("flat");
const os = require("os");
const shortid = require("shortid");
const { isEmpty } = require("lodash");

const enums = require("../../json/enums");

const logger = require("../logger");
const utils = require("../utils");

module.exports = exports = async (req, res, next) => {
	if (req.originalUrl === "/") {
		res.status(enums.HTTP_CODES.OK).send("OK");
		return;
	}

	req.requestId = shortid.generate(); // assign a short id to the request so that can be correlated with the response

	let messageToLog = `REQ [${req.requestId}] [${req.method}] ${req.originalUrl}`;
	if (req.user) {
		messageToLog += `\nfrom: ${req.user._id} (type: ${req.user.type})`;
	}

	if (!isEmpty(req.body)) {
		if (req.originalUrl !== "/user/kyc") {
			let body = { ...req.body };
			if (
				req.originalUrl === "/webhook/adyen" &&
				body.notificationItems &&
				body.notificationItems?.length > 0
			) {
				for (let i = 0; i < body.notificationItems.length; i++) {
					body.notificationItems[
						i
					].NotificationRequestItem.additionalData = utils.sortByKeys(
						body.notificationItems[i].NotificationRequestItem
							.additionalData
					);
				}
			}
			body = flatten(body); // flattening the body for logging
			messageToLog += "\nbody: " + JSON.stringify(body, null, 4);
		}
	}

	if (!isEmpty(req.headers)) {
		let headers = { ...req.headers };
		delete headers.authorization;
		headers = utils.sortByKeys(headers);
		messageToLog += "\nheaders: " + JSON.stringify(headers);
	}

	if (req.originalUrl === "/ping") {
		res.status(enums.HTTP_CODES.OK).send("OK");
	} else if (/about(\??(.*)$|$)/i.test(req.originalUrl)) {
		logger.info(messageToLog);
		return next();
	} else {
		logger.info(messageToLog);

		/* log the request in database */
		const networkInterfaces = os.networkInterfaces();
		const entry = {
			description: "Incoming request logged",
			requestId: req.requestId,
			requestBody: JSON.stringify(req.body),
			requestHeaders: JSON.stringify(req.headers),
			requestIp: req.ip,
			requestMethod: req.method,
			requestPath: req.originalUrl,
			requestProtocol: JSON.stringify(req.protocol),
			requestUserAgent: req.get("user-agent"),
			serverHostname: os.hostname(),
			serverNetworkInterfaces: JSON.stringify(networkInterfaces),
			time: Date.now(),
		};

		try {
			await global.models.GLOBAL.LOG.create(entry);
		} catch (error) {
			if (error) {
				logger.error(
					"Error encountered while trying to log the incoming request:\n" +
						error
				);
			}
		}

		// Check for the X-Version-Server for API calls, BUT ignore this check for /webhook calls
		//  let skipServerVersionCheck = false;

		//  for (let i = 0; i < whitelists.urls.ignoreServerCheck.length; i++) {
		//      if (req.originalUrl.indexOf(whitelists.urls.ignoreServerCheck[i]) !== -1) {
		//          skipServerVersionCheck = true;
		//          break;
		//      }
		//  }

		//  if (!skipServerVersionCheck) {
		//      // Handle this later
		//  }

		//  // Check for deprecated urls
		//  if (redirects.deprecated[req.originalUrl]) {
		//      return res.redirect(enums.HTTP_CODES.PERMANENT_REDIRECT, redirects.deprecated[req.originalUrl]);
		//  }

		next();
	}
};
