require("dotenv").config()

const fs = require('fs')
const filesize = require('filesize');
const misc = require('../helpers/response')

module.exports = {

  postMedia: async(req, res) => {
    const { folder } = req.body 

    try {
      if(typeof folder == "undefined") {
        throw new Error("folder is required")
      }
      if(req.files != null) {
        await fs.promises.mkdir(`${process.cwd()}/public/images/${folder}`, { recursive: true })
        let file = req.files.media
        let mimeType = file.mimetype
        let name = file.name
        let size = filesize(file.size)
        file.mv(`${process.cwd()}/public/images/${folder}/${name}`)
        misc.response(res, 200, false, null, {
          "path": `/images/${folder}/${name}`,
          "name": name,
          "size": size,
          "mimetype": mimeType
        })
      } else {
        throw new Error("media is required")
      }
    } catch(e) {
      console.log(e.message) // in-development
      misc.response(res, 400, true, e.message)
    }
  }, 

}
