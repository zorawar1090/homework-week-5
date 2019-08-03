const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const { Router } = require('express')

const app = express()
const port = 3000
const parserMiddleware = bodyParser.json()
const router = new Router()

app.use(parserMiddleware)
app.use(router)
app.listen(port, () => console.log(`Listening on port ${port}`))

const databaseUrl = 'postgres://postgres:movies@localhost:5432/postgres'
const db = new Sequelize(databaseUrl)

db.sync()
  .then(() => console.log('Database connected'))
  .catch(console.error)

const Movie = db.define(
  'movie',
  {
    title: Sequelize.STRING,
    yearOfRelease: Sequelize.INTEGER,
    synopsis: Sequelize.STRING
  }
)

Movie.create({
  title: 'Titanic',
  yearOfRelease: '1996',
  synopsis: 'Great Movie'
})

router.post('/movies', (req, res, next) => {
  Movie
    .create(req.body)
    .then(movie => res.send(movie))
    .catch(next)
})

router.get('/movies', (req, res, next) => {
  const limit = req.query.limit || 2
  const offset = req.query.offset || 0

  Movie
    .findAndCountAll({ limit, offset })
    .then(result => {
      res.send({ movies: result.rows, total: result.count })
    })
    .catch(next)
})

router.get('/movies/:id', (req, res, next) => {
  Movie
    .findByPk(req.params.id)
    .then(movie => res.send(movie))
    .catch(next)
})

router.put('/movies/:id', (req, res, next) => {
  Movie
    .findByPk(req.params.id)
    .then(movie => {
      movie.update(req.body)
    })
    .then(res.send())
    .catch(next)
})

router.delete('/movies/:id', (request, response, next) => {
  Movie
    .destroy({ where: { id: request.params.id } })
    .then(deletedMoviesCount => response.send({ deletedMoviesCount }))
    .catch(next)
})