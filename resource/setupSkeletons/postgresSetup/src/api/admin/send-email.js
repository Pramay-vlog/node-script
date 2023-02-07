const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const nodemailer = require("nodemailer");

/* Send otp via email for reset password. */

module.exports = exports = {
  // route validation
  validation: Joi.object({
    email: Joi.string().email().required(),
  }),

  // route handler
  handler: async (req, res) => {
    try {
      const { email } = req.body;

      let findUser = await global.models.GLOBAL.ADMIN.findOne({
        where: { email: email },
        raw: true,
      });
      if (!findUser) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      /* Generate Code */
      const code = Math.floor(Math.random() * (999999 - 100000) + 100000);

      // let transporter = nodemailer.createTransport({
      // 	service: "gmail",
      // 	host: "smtp.gmail.com",
      // 	port: 587,
      // 	secure: false,
      // 	auth: {
      // 		user: process.env.EMAIL,
      // 		pass: process.env.PASSWORD,
      // 	},
      // });
      // Ethereal test account
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "modesto.halvorson87@ethereal.email",
          pass: "ArtPQPxjBWPQdQxazu",
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "XXXXX| OTP To Verify Your Email",
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
                </head>
                <style>
                    body {
                        font-family: 'Ubuntu', sans-serif;
                        background-color: #f5f5f5;
                    }
                
                    * {
                        box-sizing: border-box;
                    }
                
                    p:last-child {
                        margin-top: 0;
                    }
                
                    img {
                        max-width: 100%;
                    }
                </style>
                
                <body style="margin: 0; padding: 0;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px 0 30px 0;">
                                <table align="center" cellpadding="0" cellspacing="0" width="600" style=" border-collapse: collapse; border: 1px solid #ececec; background-color: #1479FF;">
                                    <tr>
                                        <td align="center" style="position: relative;">
                                            <div
                                            class="company-logo-align"
                                            style=" padding: 2rem 2rem 1rem 2rem; display: flex; align-items: center; justify-content: center;background: #fff; margin: 0 auto;"
                                            align="center">
                                                <img  src="https://naija-teledoc.s3.us-east-2.amazonaws.com/files/61e6805ac7340d2664dba844-file-1642500289876.png" style= "margin:0 auto; height: 100px;cursor: pointer;"/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="user-information" 
                                            style="padding: 25px; background-color: #1479FF; width: 91.6%;"
                                            >
                                            <h1 align="center" style="color: #fff; font-size: 35px; font-weight: 500; margin: 0 0 1rem 0;">Hi ${findUser.firstName} ${findUser.lastName}</h1>
                                            <p align="center" style="color: #fff; font-size: 30px; font-weight: 500; margin: 0 0 1rem 0;">Welcome to XXXXX®</p>
                                            </div>
                                          
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 3rem 2rem 2rem 2rem;">
                                          <h2 align="center" style="color: #fff; font-size: 30px; ">Verify your Email Address</h2>
                                          <p align="center" style="color: #fff; font-size: 14px; margin: 2.50rem 0 2rem 0;">Please find below your one time passcode.</p>
                                          <h6 align="center" style="font-size: 40px; color: #fff; margin: 0;  margin-top: 0;">OTP : ${code}</h6>
                                        </td>
                                    </tr>
                                  
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                
                </html>`,
      });

      await global.models.GLOBAL.CODEVERIFICATION.destroy({
        where: { email: email },
      });
      await global.models.GLOBAL.CODEVERIFICATION.create({
        email: email,
        code: code,
        date: Date.now(),
        expirationDate: new Date(new Date().getTime() + 5 * 60 * 1000),
        failedAttempts: 0,
      });
      const data4createResponseObject = {
        req: req.body,
        result: 0,
        message: messages.MAIL_SENT,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error while sending Mail : ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
