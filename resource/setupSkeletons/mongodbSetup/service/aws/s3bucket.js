const aws = require("aws-sdk");
const enums = require("../../json/enums.json");
const message = require("../../json/message.json");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: process.env.REGION,
});

const s3 = new aws.S3();

// multer file upload setup
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname }); 
    },
    key: function (req, file, cb) {
      cb(
        null,
        "xxxxx" +
          "-" +
          Date.now().toString() +
          Date.now().toString() +
          "." +
          file.mimetype.split("/")[file.mimetype.split("/").length - 1]
      );
    },
  }),

  limits: { fileSize: 1024 * 1024 * 20, files: 10 },
});

// multer file delete setup
const deleteFile = (key) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: key,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log("File deletion error: ", err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
};

// Error handling
const uploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.log("error", error.code);
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
        status: false,
        message: message.imageIsLarge,
        error: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
        status: false,
        message: message.maxUploadReached,
        error: "maximum file upload limit",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
        status: false,
        message: message.unexpectedFile,
        error: "file-type not supported",
      });
    }
  }
};

module.exports = { upload, uploadError, deleteFile };
