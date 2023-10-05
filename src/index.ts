import express, { type Application, type Request, type Response } from 'express'
import bodyParser from 'body-parser'

const app: Application = express()
const PORT = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response): Promise<Response> => res.status(200).send({
    message: 'Hello World!'
  }))

app.post('/post', async (req: Request, res: Response): Promise<Response> => res.status(200).send({
    message: 'Hello World from post!'
  }))

try {
  app.listen(PORT, (): void => {
    // eslint-disable-next-line no-console
    console.log(`Connected successfully on port ${PORT}`)
  })
} catch (error: any) {
    // eslint-disable-next-line no-console
  console.error(`Error occured: ${error.message}`)
}
