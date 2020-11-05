///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
} from "./database";
import { os, GeoLocation, browser, Event, eventName, weeklyRetentionObject, DayAndSessionCount, Database, Filter, FilteredEvents, HourAndSessionCount } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware, getAllEvents, getEndDate, getRetentionCohort, sortByDate, getAllEventsWithNormalDates, getAllEventsWithNormalDateTime, getEventsDitsinctByDay, updateDb, filterEvents, getEventsDitsinctByHour, getSessionsByDays, getAllSessionFromDate } from "./helpers";
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
    const sessionsByDay = getSessionsByDays();
    const offSet = parseInt(req.params.offset);
    const startIndex:number = sessionsByDay.length - offSet - 7;
    const endIndex:number = sessionsByDay.length - offSet;
    res.json(sessionsByDay.slice(startIndex, endIndex));
    //res.json(sessionsByDay);
  } catch (error) {
    res.status(404).send(`Couldn't get the data :(`)
  }
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
    const sessionsByDay = getSessionsByDays();
    const offset:number = parseInt(req.params.offset);
    const filterDate = sessionsByDay[sessionsByDay.length - 1 - offset].date;
    console.log(filterDate);
    const sessionsOfDate = getAllSessionFromDate(filterDate);
    res.json(getEventsDitsinctByHour(sessionsOfDate));
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const dayZero:number = parseInt(req.query.dayZero);
  const retention: weeklyRetentionObject[] = getRetentionCohort(dayZero);
  res.send(retention);
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
