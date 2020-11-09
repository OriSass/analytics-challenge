///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {
} from "./database";
import { os, GeoLocation, browser, Event, BrowserDistribution, eventName, weeklyRetentionObject, DayAndSessionCount, Database, Filter, FilteredEvents, HourAndSessionCount, BrowserCount } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware, getAllEvents, getBrowserDistribution, getBrowsersCount, getEndDate, getRetentionCohort, sortByDate, getAllEventsWithNormalDates, getAllEventsWithNormalDateTime, getEventsDitsinctByDay, addNewEvent, filterEvents, getEventsDitsinctByHour, getSessionsByDays, getAllSessionFromDate } from "./helpers";
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { values } from "lodash";
import db from "./database";
const router = express.Router();
const fs = require('fs');

// Routes
router.get('/all', (req: Request, res: Response) => {
  try {  
    //console.log("first endpoint");
      
    res.json(getAllEvents());
  } catch (error) {
    console.error(error);
    
    res.status(404).send(`\n${error.message}\n`)
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
    try {
      const OneHour: number = 1000 * 60 * 60;
      const OneDay: number = OneHour * 24;
      const offset = parseInt(req.params.offset)
      const offsetInMili: number = OneDay * offset;
      const endOfTodayInMili: number = new Date(new Date().toDateString()).getTime() + OneDay;

      let date: string = new Date(endOfTodayInMili - OneDay - offsetInMili).toLocaleDateString();
      let day = date.split('/')[0];
      const month = date.split('/')[1];
      const year = date.split('/')[2];
      day = day[0] === "0" ? day[1] : day[0];
      date = `${month}/${day}/${year}`;
      console.log(date);
      
      const sessionsOfDate = getAllSessionFromDate(date);
      const groupedSessions = getEventsDitsinctByHour(sessionsOfDate)
      res.json(groupedSessions);
    } catch (error) {
      console.log(error.message);
    }
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const dayZero:number = parseInt(req.query.dayZero);
  console.log(dayZero);  
  const retention: weeklyRetentionObject[] = getRetentionCohort(dayZero);
  res.send(retention);
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});


router.get('/chart/os',(req: Request, res: Response) => {
  const browserAndCount:BrowserCount[] = getBrowsersCount();
  const browserDistribution: BrowserDistribution[] = getBrowserDistribution(browserAndCount);
  res.json(browserDistribution);
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
  const newEvent: Event = req.body;
  db.get('events').push(newEvent).write();
  res.status(200).send('Database up to date!');
});

export default router;
