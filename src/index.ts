import express, { type Application, type Request, type Response } from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import ServerSocket from './socket'

const PORT = 3001
const app: Application = express()

const httpServer = http.createServer(app)

// eslint-disable-next-line
new ServerSocket(httpServer)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response): Promise<Response> => res.status(200).send({
    message: 'Hello World!'
  }))

app.post('/post', async (req: Request, res: Response): Promise<Response> => res.status(200).send({
    message: 'Hello World from post!'
  }))

httpServer.listen({ port: PORT }, (): void => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
