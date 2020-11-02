///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();
const fs = require('fs');

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}
interface Database{
  events: Event[];
}

router.get('/all', (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync('./data/database.json');
    const { events } = JSON.parse(data);    
    res.json(events);
  } catch (error) {
    res.status(404).send(`\nWhoops! Didn't find any data!\n`)
  }    
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filters: Filter = req.query;

  res.send('/all-filtered')
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  res.send('/by-days/:offset')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});


router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})

router.post('/', (req: Request, res: Response) => {
  res.send('/')
});

router.post('/event', (req: Request, res: Response) => {
  const data = fs.readFileSync('./data/database.json');
  const { events } = JSON.parse(data);
  const newEvent: Event = req.body;
  events.push(newEvent);
  const newData:Database = {
    events: events
  };
  const updatedJson = JSON.stringify(newData);
  
  fs.writeFile('./data/database.json', updatedJson, (err:Error) => {
    if(err){
      console.log(err.message)
    }});
  res.status(200).send('Database up to date!');
//   fs.readFile('./data/database.json', 'utf8', function readFileCallback(err: Error, jsonData: string){
//     if (err){
//         console.log(err);
//     } else {
//       const newEvent: Event = req.body;
//       console.log(`\nnewEvent is ${newEvent}\n`);
//       const { events } = JSON.parse(jsonData) 
//       events.push(newEvent); //add some data
//       const updatedJson = JSON.stringify(events); //convert it back to json
//       fs.writeFile('./server/data/database.json', updatedJson, 'utf8'); // write it back 
// }});
//   res.status(200).send("\n\nDatabase Updated\n\n");
});

export default router;
