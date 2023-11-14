const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_REGION,
  BUCKET_NAME
} = process.env
const s3Client = new S3Client({
  region: S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})
const s3FileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = Date.now().toString() + '-' + file.originalname // 生成檔案名稱
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    }
    return s3Client.send(new PutObjectCommand(params))
      .then(() => resolve(`https://${BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  s3FileHandler
}
// local方法
// const fs = require('fs')
// const localFileHandler = file => {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     const fileName = `upload/${file.originalname}`
//     return fs.promises.readFile(file.path)
//       .then(data => fs.promises.writeFile(fileName, data))
//       .then(() => resolve(`/${fileName}`))
//       .catch(err => reject(err))
//   })
// }
// module.exports = {
//   localFileHandler
// }
