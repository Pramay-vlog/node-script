// var admin = require("firebase-admin");
// var serviceAccount = require("../../firebase-config.js");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const options = {
//   priority: "high",
//   timeToLive: 60 * 60 * 24,
// };

// const sendPushNotification = (data) => {
//   if(data.deviceId!=null){

//   admin
//     .messaging()
//     .sendToDevice(data.deviceId, data.payload, options)
//     .then(function (response) {
//       if (response) {
//         console.log("vSuccessfully sent message:", response.results);
//         console.log("vSuccessfully sent message:", response.results[0]);
//       } else {
//         console.log("vError", response.results);
//       }
//     })
//     .catch(function (error) {
//       console.log("vError sending message:", error);
//     });
//   }
// };

// module.exports = {
//   sendPushNotification,
// };
