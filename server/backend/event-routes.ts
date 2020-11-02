///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
} from "./database";
import { os, GeoLocation, browser, Event, eventName, weeklyRetentionObject, DayAndSessionCount, Database, Filter, FilteredEvents } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware, getAllEvents, sortByDate, getAllEventsWithNormalDates, getEventsDitsinctByDay, updateDb, filterEvents } from "./helpers";
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { values } from "lodash";
const router = express.Router();
const fs = require('fs');

// Routes
router.get('/all', (req: Request, res: Response) => {
  try {    
    res.json(getAllEvents());
  } catch (error) {
    res.status(404).send(`\nWhoops! Didn't find any data!\n`)
  }    
});

router.get('/all-filtered', (req: Request, res: Response) => {
  try{
    let events: Event[] = getAllEvents(); 
    const filters: Filter = req.query;
    const filtered = filterEvents(events, filters);
    res.json(filtered);
  }
  catch(err){
    res.status(404).send(`We Couldn't filter the data :(`)
  }
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  try {
    let events: Event[] = getAllEvents();
    sortByDate(events, '+');
    events = getAllEventsWithNormalDates(events);
    const sessionByDay: DayAndSessionCount[] = getEventsDitsinctByDay(events);  
    const offset:number = parseInt(req.params.offset);
    res.json(sessionByDay.slice(sessionByDay.length - offset - 7, sessionByDay.length - offset));
  } catch (error) {
    res.status(404).send(`Couldn't get the data :(`)
  }
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
