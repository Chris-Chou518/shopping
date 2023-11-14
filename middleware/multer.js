const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(), // 使用記憶體儲存，檔案將保存在 RAM 中
  fileFilter: function (req, file, cb) {
    // 驗證檔案類型，只接受 jpg 和 png 格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only jpg and png formats are allowed!'), false)
    }
    cb(null, true)
  }
})
module.exports = upload
// local方法
// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
// module.exports = upload
