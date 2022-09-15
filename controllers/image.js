const router = require('express').Router()
const path = require('path')

const FILES_DIR = path.join(__dirname, '../public/img/userAvatars')

router.get('/:avatarUrl',(req, res, next) => {
  const options = {
    root: FILES_DIR,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  const fileName = req.params.avatarUrl
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      res.end()
    }
  })
})

module.exports = router