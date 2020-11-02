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

const getAllEvents = (): Event[] => {
  const data = fs.readFileSync('./data/database.json');
  const { events } = JSON.parse(data);
  return events;
}
const updateDb = (updatedData: Database): void => {
  const updatedJson = JSON.stringify(updatedData);
  fs.writeFile('./data/database.json', updatedJson, (err:Error) => {
    if(err){
      console.log(err.message)
    }});
}

router.get('/all', (req: Request, res: Response) => {
  try {    
    res.json(getAllEvents());
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
  const events = getAllEvents();
  const newEvent: Event = req.body;
  events.push(newEvent);
  const newData:Database = {
    events: events
  };
  updateDb(newData);
  res.status(200).send('Database up to date!');
});

export default router;
