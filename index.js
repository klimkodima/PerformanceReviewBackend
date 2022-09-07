const express = require('express')
require('express-async-errors')
const cors = require('cors')
const logger = require('./util/logger')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const widgetRouter = require('./controllers/widget')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const imageRouter = require('./controllers/image')
const teamRouter = require('./controllers/team')
const activityRouter = require('./controllers/activity')
const middleware = require('./util/middleware')
const helmet = require('helmet')

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/v2/widget', widgetRouter)
app.use('/api/v2/user', usersRouter)
app.use('/api/v2/auth/login', loginRouter)
app.use('/api/v2/image', imageRouter)
app.use('/api/v2/team', teamRouter)
app.use('/api/v2/activity', activityRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()