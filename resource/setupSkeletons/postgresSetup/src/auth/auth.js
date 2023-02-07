"use strict";
//  const AnonymousStrategy = require("passport-anonymous").Strategy;
//  const BasicStrategy = require("passport-http").BasicStrategy;
//  const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

//  const LocalStrategy = require("passport-local").Strategy;
const moment = require("moment");
const passport = require("passport");
const { isEmpty } = require("lodash");
const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");
const https = require("https");
const jwtOptions = require("./jwt-options");
const logger = require("../logger");
const { Op } = require("sequelize");
const { NODE_ENV = "local" } = process.env;
module.exports.setup = () => {
  /* JWT strategy */
  passport.use(
    new JwtStrategy(jwtOptions, (req, jwt_payload, next) => {
      const { id, type, environment, scope, date, phone } = jwt_payload;
      const reqInfo = `REQ [${req.requestId}] [${req.method}] ${req.originalUrl}`;
      logger.info(
        `${reqInfo} - #JwtStrategy - \npayload: ${JSON.stringify(jwt_payload)}`
      );
      let criteria = { status: {} };
      if (
        type === enums.USER_TYPE.USER ||
        type === enums.USER_TYPE.SUPERADMIN ||
        type === enums.USER_TYPE.ADMIN
      ) {
        /* Check if the token was generated from the same environment */
        if (
          !isEmpty(environment) &&
          environment !== NODE_ENV &&
          NODE_ENV !== "local"
        ) {
          logger.error("#JwtStrategy - Invalid token!");
          next(null, false);
        }
        criteria = {
          status: {
            [Op.notIn]: [
              enums.USER_STATUS.BLOCKED,
              enums.USER_STATUS.DISABLED,
              enums.USER_STATUS.INACTIVE,
            ],
          },
          _id: id,
        };
      }

      if (!criteria) return next(null, false);
      global.models.GLOBAL.ADMIN.findOne({
        where: criteria,
        raw: true,
        attributes: { exclude: ["password", "address"] },
      })
        .then((object) => {
          if (!object) {
            logger.info("#JwtStrategy - No entry found!");
            next(null, false);
          } else {
            // logger.info("#JwtStrategy - Entry found!");
            object.scope = scope;
            object.type = type;
            next(null, object);
          }
        })
        .catch((error) => {
          logger.error(
            `#JwtStrategy - Error encountered: ${error.message}\n${error.stack}`
          );
          next(null, false);
        });
    })
  );

  // /* Facebook Strategy */
  // passport.use(
  //   new FacebookStrategy(
  //     {
  //       clientID: process.env.FACEBOOK_CLIENT_ID,
  //       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  //       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  //       profileFields: [
  //         "id",
  //         "email",
  //         "friends",
  //         "displayName",
  //         "name",
  //         "picture.type(large)",
  //       ],
  //       passReqToCallback: true,
  //     },
  //     function (req, token, refreshToken, profile, done) {
  //       process.nextTick(async function () {
  //         try {
  //           const userId = req.query.state;
  //           const detailsFound = {
  //             _id: userId,
  //             email: profile?.emails[0]?.value,
  //             firstName: profile?._json?.first_name,
  //             lastName: profile?._json?.last_name,
  //             facebookPhoto: profile?.photos[0]?.value,
  //           };
  //           return done(null, detailsFound);
  //         } catch (error) {
  //           logger.error(
  //             `#FacebookStrategy - Error encountered: ${error.message}\n${error.stack}`
  //           );
  //           return done(null, {
  //             message: messages.GENERAL,
  //           });
  //         }
  //         // return done(null, profile);
  //       });
  //     }
  //   )
  // );

  // /* Linkedin Strategy */
  // passport.use(
  //   new LinkedInStrategy(
  //     {
  //       clientID: process.env.LINKEDIN_CLIENT_ID,
  //       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  //       callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  //       scope: ["r_emailaddress", "r_liteprofile"],
  //       passReqToCallback: true,
  //     },

  //     function (req, accessToken, refreshToken, profile, done) {
  //       process.nextTick(async function () {
  //         try {
  //           const userId = req.query.state;

  //           const detailsFound = {
  //             _id: userId,
  //             email: profile?.emails[0]?.value,
  //             firstName: profile.name.givenName,
  //             lastName: profile.name.familyName,
  //             linkedinPhoto: profile.photos[0].value,
  //           };
  //           return done(null, detailsFound);
  //         } catch (error) {
  //           logger.error(
  //             `#LinkedinStrategy - Error encountered: ${error.message}\n${error.stack}`
  //           );
  //           return done(null, {
  //             message: messages.GENERAL,
  //           });
  //         }
  //         // return done(null, profile);
  //       });
  //     }
  //   )
  // );

  // /* Google Strategy */
  // // passport.use(
  // // 	new GoogleStrategy(
  // // 		{
  // // 			clientID: process.env.GOOGLE_CLIENT_ID,
  // // 			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // // 			callbackURL: process.env.CALLBACK_URL,
  // // 			passReqToCallback: true,
  // // 		},
  // // 		async function (req, accessToken, refreshToken, profile, done) {
  // // 			// console.log("||||||||||||||||||||||>>>>>>>>>", req.query.state);
  // // 			process.nextTick(async function () {
  // // 				const email =
  // // 					profile.email ||
  // // 					profile._json.email ||
  // // 					profile.emails[0].value;
  // // 				if (!email) {
  // // 					logger.info("#GoogleStrategy - No email found!");
  // // 					return done(null, {
  // // 						message: messages.EMAIL_NOT_FOUND,
  // // 					});
  // // 				}
  // // 				try {
  // // 					let user = await global.models.GLOBAL.ADMIN.findOne({
  // // 						where: {
  // // 							email: email,
  // // 						},
  // // 						attributes: { exclude: ["password", "token"] },
  // // 						raw: true,
  // // 					});
  // // 					if (user) {
  // // 						return done(null, user);
  // // 					} else {
  // // 						const registerUser = {
  // // 							email: email,
  // // 							firstName: profile._json.given_name,
  // // 							lastName: profile._json.family_name,
  // // 							photo: profile._json.picture || profile.picture,
  // // 							status: enums.USER_STATUS.ACTIVE,
  // // 							statusModificationDate: Date.now(),
  // // 						};
  // // 						return done(null, registerUser);
  // // 					}
  // // 				} catch (error) {
  // // 					logger.error(
  // // 						`#GoogleStrategy - Error encountered: ${error.message}\n${error.stack}`
  // // 					);
  // // 					return done(null, {
  // // 						message: messages.GENERAL,
  // // 					});
  // // 				}
  // // 				// return done(null, profile);
  // // 			});
  // // 		}
  // // 	)
  // // );

  // passport.serializeUser(function (user, done) {
  //   return done(null, user);
  // });

  // passport.deserializeUser(async function (user, done) {
  //   let userFound = await global.models.GLOBAL.ADMIN.findOne({
  //     where: {
  //       email: user.email,
  //     },
  //     attributes: { exclude: ["password", "token"] },
  //     raw: true,
  //   });
  //   return done(err, userFound);
  // });
};
