const router = require('express').Router()
const fs = require('fs')
const stream = require('stream')

router.get('/:avatarUrl',(req, res) => {
  console.log(req.params.avatarUrl)
  const r = fs.createReadStream('path to file') // or any other way to get a readable stream
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  stream.pipeline(
   r,
   ps, // <---- this makes a trick with stream error handling
   (err) => {
    if (err) {
      console.log(err) // No such file or any other kind of error
      return res.sendStatus(400); 
    }
  })
  ps.pipe(res) // <---- this makes a trick with stream error handling
})

module.exports = router