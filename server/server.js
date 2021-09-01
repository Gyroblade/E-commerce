import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

// my code <START>
const { readFile, stat, writeFile, unlink } = require('fs').promises

server.get('/api/v1/data', (req, res) => {
  stat(`${__dirname}/data.json`)
    .then(() =>
      /* случается когда есть файла */
      readFile(`${__dirname}/data.json`, { encoding: 'utf8' }).then((text) => {
        res.json(JSON.parse(text).filter((it, index) => index < 20))
      })
    )
    .catch(async () => {
      /* случается когда нет файла */
      res.json(`File 'data.json' not found`)
    })
})

server.get('/api/v1/rates', async (req, res) => {
  await axios
    .get('https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,CAD')
    .then(({ data }) => res.json(data.rates))
})

server.get('/api/v1/logs', (req, res) => {
  readFile(`${__dirname}/logs.json`, { encoding: 'utf8' }).then((text) =>
    res.json(JSON.parse(text))
  )
})

server.patch('/api/v1/logs/', (req, res) => {
  const { log, time } = req.body
  stat(`${__dirname}/logs.json`)
    .then((data /* случается когда есть файла */) =>
      readFile(`${__dirname}/logs.json`, { encoding: 'utf8' }).then((text) => {
        const arr = JSON.parse(text)
        const newData = arr.concat([{ log, time }])
        writeFile(`${__dirname}/logs.json`, JSON.stringify(newData), { encoding: 'utf8' })
        res.json({ status: 'success log' })
      })
    )
    .catch((err /* случается когда нет файла */) => {
      const newData = [{ log, time }]
      writeFile(`${__dirname}/logs.json`, JSON.stringify(newData), { encoding: 'utf8' })
      res.json({ status: 'success log / new log file created' })
    })
})

server.delete('/api/v1/logs', (req, res) => {
  unlink(`${__dirname}/logs.json`)
  res.json({ status: 'log delete success' })
})

// my code <END>

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
