/**
 *  Created by saad.sami on 04/10/2019.
 */

"use strict";

const multer = require("multer"),
  globalVariables = require("@config/globalVariables")._globals,
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
      let filename = file.originalname.substr(
        0,
        file.originalname.lastIndexOf(".")
      );
      filename = filename
        .split(",")
        .join("")
        .split(".")
        .join("")
        .split(" ")
        .join("");
      let fileType = file.originalname.substr(
        file.originalname.lastIndexOf(".") + 1
      );
      fileType = fileType
        ? fileType
        : file.mimetype.substr(file.mimetype.lastIndexOf("/") + 1);
      cb(null, filename.toLowerCase() + "-" + Date.now() + "." + fileType);
    }
  }),
  allow_filesType = {
    image: ["image/png", "image/jpeg", "image/jpg"],
    // application: [
    //   "application/xml",
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //   "application/pdf"
    // ]
  };

let checkFileType = (file, types) => {
  var found = false;
  for (var i = 0; i < types.length; i++) {
    found = file.mimetype === types[i];
    if (found) {
      break;
    }
  }
  return found;
};

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    var obj = {};

    let type = file.mimetype.substr(0, file.mimetype.indexOf("/"));

    if (!checkFileType(file, allow_filesType[type])) {
      obj["fileErrors"] = {
        message: "Invalid file type please check allowed files in api docs."
      };

      return cb(obj);
    }
    cb(null, true);
  }
});

exports.baseUrlGenerator = req => {

  var tempArray = [];
  // console.log(req.file)
  if (req.file) {
    console.log(req.file.destination.substr(req.file.destination.indexOf("/")))
    console.log(
      {
        url:
          globalVariables.fileUrl +
          req.file.destination.substr(req.file.destination.indexOf("/")) +
          req.file.filename,
        // url: 'http://' + req.headers.host + req.file.destination.substr(req.file.destination.indexOf('/')) + req.file.filename,
        size: req.file.size,
        filename: req.file.filename,
        fileType: req.file.mimetype
      }
    )
    return {
      url:
        globalVariables.fileUrl +
        req.file.destination.substr(req.file.destination.indexOf("/")) +
        req.file.filename,
      // url: 'http://' + req.headers.host + req.file.destination.substr(req.file.destination.indexOf('/')) + req.file.filename,
      size: req.file.size,
      filename: req.file.filename,
      fileType: req.file.mimetype
    };
  } else if (req.files) {
    for (var i in req.files) {
      tempArray.push({
        url:
          globalVariables.fileUrl +
          req.files[i].destination.substr(
            req.files[i].destination.indexOf("/")
          ) +
          req.files[i].filename,
        // url: 'http://' + req.headers.host + req.files[i].destination.substr(req.files[i].destination.indexOf('/')) + req.files[i].filename,
        size: req.files[i].size,
        filename: req.files[i].filename,
        fileType: req.files[i].mimetype
      });
    }
    console.log(tempArray)
    return tempArray;
  } else {
    return {};
  }
};
