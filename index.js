const express = require('express')
require('express-async-errors')
const cors = require('cors')
const cluster = require('cluster')
const logger = require('./util/logger')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const widgetRouter = require('./controllers/widget')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const imageRouter = require('./controllers/image')
const teamRouter = require('./controllers/team')
const activityRouter = require('./controllers/activity')
const { requestLogger,
  clusterLogger,
  unknownEndpoint,
  errorHandler
} = require('./util/middleware')
const helmet = require('helmet')

const app = express()
app.use(helmet(({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
})))
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(clusterLogger)

app.use('/api/v2/widget', widgetRouter)
app.use('/api/v2/user', usersRouter)
app.use('/api/v2/auth/login', loginRouter)
app.use('/api/v2/image', imageRouter)
app.use('/api/v2/team', teamRouter)
app.use('/api/v2/activity', activityRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const startWorker = () => {
  const worker = cluster.fork()
  console.log(`CLUSTER: Worker ${worker.id} started`)
}

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

if (cluster.isMaster) {

  require('os').cpus().forEach(startWorker)

  // log any workers that disconnect; if a worker disconnects, it
  // should then exit, so we'll wait for the exit event to spawn
  // a new worker to replace it
  cluster.on('disconnect', worker => console.log(
    `CLUSTER: Worker ${worker.id} disconnected from the cluster.`
  ))

  // when a worker dies (exits), create a worker to replace it
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `CLUSTER: Worker ${worker.id} died with exit ` +
      `code ${code} (${signal})`
    )
    startWorker()
  })

} else {
  start()
}