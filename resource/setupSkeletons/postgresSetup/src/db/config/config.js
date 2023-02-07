require("dotenv").config();
/* For Production */
// module.exports = {
// 	development: {
// 		username: process.env.PG_USER_DEV_1,
// 		password: process.env.PG_PASSWORD_DEV_1,
// 		database: "dfwlmofz",
// 		host: "satao.db.elephantsql.com",
// 		dialect: "postgres",
// 		logging: false,
// 		freezeTableName: true,
// 	},
// 	test: {
// 		username: "xxxx",
// 		password: "xxxx",
// 		database: "xxxx",
// 		host: "xxxx",
// 		dialect: "xxxx",
// 		logging: false,
// 		freezeTableName: true,
// 	},
// 	production: {
// 		username: "xxxx",
// 		password: "xxxx",
// 		database: "xxxx",
// 		host: "xxxx",
// 		dialect: "xxxx",
// 		logging: false,
// 		freezeTableName: true,
// 	},
// };

/* For Development */
module.exports = {
  /* To use Heroku db */
  // development: {
  // 	username: process.env.PG_USER_DEV_H,
  // 	password: process.env.PG_PASSWORD_DEV_H,
  // 	database: "dfh95956cm9fcp",
  // 	host: "ec2-3-219-229-143.compute-1.amazonaws.com",
  // 	dialect: "postgres",
  // 	logging: false,
  // 	freezeTableName: true,
  // 	/* Options for Heroku */
  // 	dialectOptions: {
  // 		ssl: {
  // 			require: true,
  // 			rejectUnauthorized: false,
  // 		},
  // 	},
  // },
  // /* To use local db */
  development: {
    username: "postgres",
    password: "admin",
    database: "XXXXX",
    host: "localhost",
    dialect: "postgres",
    logging: false,
    freezeTableName: true,
  },

  /* Another online server config */
  // development: {
  //   username: process.env.PG_USER_DEV_2,
  //   password: process.env.PG_PASSWORD_DEV_2,
  //   database: "viugpkno",
  //   host: "surus.db.elephantsql.com",
  //   dialect: "postgres",
  //   logging: false,
  //   freezeTableName: true,
  // },
};
