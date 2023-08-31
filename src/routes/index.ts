import express, { Request, Response } from 'express'
// import middlewares from '../middlewares';
import demo from './demo'
import cors from 'cors'

const { Router } = express
const api = Router()

const exceldata = {
  filename: '',
};

// internal middleware
// router.use(middlewares());

// '/api/'
api.get('/', (req, res) => {
  res.json({ hi: 'there' })
})

// '/api/_health'
api.get('/_health', (req, res) => {
  res.sendStatus(200)
})

// '/api/excelreport'
api.post('/excelreport', (req, res) => {
  const filename = req.body.filename || 0;

  exceldata.filename += filename;

  return res.json({ message: 'Thank you 🙏 ' });
})

const SEND_INTERVAL = 2000;

const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req: Request, res: Response) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(res, sseId, JSON.stringify(exceldata));
  }, SEND_INTERVAL);

  writeEvent(res, sseId, JSON.stringify(exceldata));
};

api.get('/notifyexcel', (req: Request, res: Response) => {
  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res);
  } else {
    res.json({ message: 'Ok' });
  }
});

// set routes here
api.use('/demo', demo)

export default api
