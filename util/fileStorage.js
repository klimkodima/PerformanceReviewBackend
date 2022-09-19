const path = require('path')
const multer = require('multer')
const fs = require('fs')

const filePath = {
  avatarImage: './public/img/userAvatars/',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.fileName = Date.now()+ file.originalname
    cb(null, path.join(__dirname, '.' + filePath[file.fieldname]))
  },
  filename: function (req, file, cb) {
    cb(null, (req.fileName))
  }
})

exports.Remove = function (path) {
  try {
    fs.unlinkSync(path)
    console.log('successfully deleted' + path)
  } catch (err) {
    console.log(err)
  }
}

exports.upload = multer({ storage: storage })
exports.filePath = filePath