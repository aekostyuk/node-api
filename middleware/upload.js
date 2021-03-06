const multer  = require("multer")

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    }
})

module.exports = multer({storage: storageConfig}).single("file")