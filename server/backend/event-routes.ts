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

router.get('/all', (req: Request, res: Response) => {
  res.send('/all')
    
});

router.get('/all-filtered', (req: Request, res: Response) => {
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
  fs.readFile('../data/database.json', 'utf8', function readFileCallback(err: Error, jsonData: string){
    if (err){
        console.log(err);
    } else {
      console.log(`jsonData is ${jsonData}`);
      const newEvent: Event = req.body;
      const data: Event[] = JSON.parse(jsonData) 
      data.push(newEvent); //add some data
      const updatedJson = JSON.stringify(data); //convert it back to json
      fs.writeFile('./server/data/database.json', updatedJson, 'utf8'); // write it back 
}});
  res.status(200).send("\n\nDatabase Updated\n\n");
});

export default router;
