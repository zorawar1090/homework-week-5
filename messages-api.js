const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 4000

const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)
app.listen(port, () => console.log(`Listening on port ${port}`))

let requestCount = 0

const messageLimitMiddleware = (req, res, next) => {
  if (requestCount > 4) {
    res.status(429).end()
  }
  else {
    requestCount++
    next()
  }
}

app.post('/messages', messageLimitMiddleware, (req, res) => {
  if (!req.body.text) {
    res.status(400).end()
  }
  else {
    res.send({
      message: 'Message received loud and clear'
    })
  }
})
