const multer = require('multer')

//CONFIG MULTER

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/imgs')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`)
    }
})

const upload = multer({storage: storage})

module.exports = upload