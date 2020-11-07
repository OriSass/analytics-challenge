import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getUserById } from "./database";
import {
  os,
  GeoLocation,
  browser,
  Event,
  eventName,
  weeklyRetentionObject,
  DayAndSessionCount,
  HourAndSessionCount,
  Database,
  Filter,
  FilteredEvents,
  DaySummary,
  BrowserCount,
  BrowserDistribution
} from "../../client/src/models/event";
import { log } from "console";
import { OneDay, OneWeek } from "./timeFrames";
const fs = require("fs");

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  /* istanbul ignore next */
  res.status(401).send({
    error: "Unauthorized",
  });
};

export const validateMiddleware = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation: any) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

export function AdminValidation(req: Request, res: Response, next: NextFunction) {
  const userId = req.session!.passport.user;
  const user = getUserById(userId);

  if (user.isAdmin) {
    next();
  } else {
    res.status(401).send({
      error: "Unauthorized",
    });
  }
}

export const getAllEvents = (): Event[] => {
  const data = fs.readFileSync("./data/database.json");
  const { events } = JSON.parse(data);
  return events;
};

export const updateDb = (updatedData: Database): void => {
  const updatedJson = JSON.stringify(updatedData);
  fs.writeFile("./data/database.json", updatedJson, (err: Error) => {
    if (err) {
      console.log(err.message);
    }
  });
};

// returns an event array with dates in dd/mm/yy instead of milliseconds
export const getAllEventsWithNormalDates = (events: Event[]): Event[] => {
  events.forEach((e: Event, i:number) => {
    e.date = msToDate(e.date as number);
  });
  return events;
};
// recieves a date in ms and returns dd/mm/yy
export const msToDate = (ms: number): string => {
  const dateObj = new Date(ms);
  const dateAndHour: string = dateObj.toLocaleString("en-US", { timeZoneName: "short" }); // FORMAT: MM/DD/YYYY, 10:30:15 AM CST
  const wierdDate: string = dateAndHour.split(",")[0];
  const day = wierdDate.split("/")[1];
  const month = wierdDate.split("/")[0];
  const year = wierdDate.split("/")[2];
  const normalDate = `${day}/${month}/${year}`;
  return normalDate;
}
// returns an event array with hours in "hh:mm" instead of milliseconds
export const getAllEventsWithNormalDateTime = (events: Event[]): Event[] => {
  events.forEach((e: Event) => {
    const dateObj = new Date(e.date);
    const dateAndHour: string = dateObj.toLocaleString("en-US", { timeZoneName: "short" }); // FORMAT: MM/DD/YYYY, 10:30:15 AM CST
    const wierdDate: string = dateAndHour.split(",")[0];
    const day = wierdDate.split("/")[1];
    const month = wierdDate.split("/")[0];
    const year = wierdDate.split("/")[2];

    const weirdTime: string = dateAndHour.split(",")[1].slice(1,8);
    const hour = weirdTime.split(":")[0];
    e.date = `${day}/${month}/${year},${hour}:00`;
  });
  return events;
};

// return an array of dates and the number of sessions in each day
export const getEventsDitsinctByDay = (events: Event[]): DayAndSessionCount[] => {
  const eByDays: DayAndSessionCount[] = [];
  events.forEach((e: Event) => {
    if (eByDays.length === 0){
      let dayAndSessions: DayAndSessionCount;
      let loginCount:number = 0;
      let signUpCount:number = 0;
      e.name === "login" ?
      loginCount++ : signUpCount++;
      dayAndSessions = { date: e.date as string, loginCount, signUpCount, count: 1 }
      eByDays.push(dayAndSessions);
    }
    else {
      let index: number = 0;
      const exists = eByDays.some((element: DayAndSessionCount, i: number) => {
        if (element.date === e.date) {
          index = i;
          return true;
        }
        return false;
      });
      if (exists) {
        e.name === "login" ?
        eByDays[index].loginCount++ :
        eByDays[index].signUpCount++;
        eByDays[index].count++;
      } else {
        let dayAndSessions: DayAndSessionCount;
        let loginCount:number = 0;
        let signUpCount:number = 0;
        e.name === "login" ?
        loginCount++ : signUpCount++;
        dayAndSessions = { date: e.date as string, loginCount, signUpCount, count: 1 }
        eByDays.push(dayAndSessions);
      }
    } 
  });
  return eByDays;
};
// return an array of hours and the number of sessions in each day
export const getEventsDitsinctByHour = (events: Event[]): HourAndSessionCount[] => {
  const eByHours: HourAndSessionCount[] = new Array(24);
  for (let i = 0; i < 24; i++){
    if(i < 10){
      eByHours[i] = { hour: `0${i}:00`, count: 0 }
    }
    else {
      eByHours[i] = { hour: `${i}:00`, count: 0 }
    }
  }
  events.forEach((e: Event) => {
    if(typeof e.date === "string"){
      let hour = e.date.split(',')[1];
      if(hour.split(':')[0].length === 1){
        hour = '0' + hour;
      }
      for (let i = 0; i < eByHours.length; i++) {
        if(eByHours[i].hour === hour){
          eByHours[i].count++;
        }
      }
    }
  });
  return eByHours;
};

// sorts the event arr from latest backwards for + and the oppisite for -
export const sortByDate = (events: Event[], plusOrMinus: string): void => {
  if (plusOrMinus === "+") {
    events.sort((event1: Event, event2: Event) => {
      return (event1.date as number) - (event2.date as number);
    });
  } else {
    events.sort((event1: Event, event2: Event) => {
      return (event2.date as number) - (event1.date as number);
    });
  }
};

// returns an event array from a specific event type
export const filterByEventName = (events: Event[], eventName: eventName): Event[] => {
  return events.filter((e) => e.name === eventName);
};

// returns an event array from a specific browser
export const filterByBrowser = (events: Event[], filterBrowser: browser): Event[] => {
  if (filterBrowser) {
    return events.filter((e) => e.browser === filterBrowser);
  } else return events;
};

// returns all events that had a certain value in their keys
export const filterBySearchValue = (
  events: Event[],
  searchValue: string | number | eventName | os | browser
): Event[] => {
  if (searchValue) {
    return events.filter((e) => {
      for (const [key, value] of Object.entries(e)) {
        if (typeof value !== "object" && key !== "date") {
          if (value.toString().includes(searchValue)) {
            return true;
          }
        }
      }
      return false;
    });
  }
  return events;
};

// returns a filtered event array
export const filterEvents = (events: Event[], filters: Filter): FilteredEvents => {
  if (filters.sorting) {
    sortByDate(events, filters.sorting[0]);
  }  
  if (filters.type) {
    events = filterByEventName(events, filters.type);
  }
  if (filters.browser) {
    events = filterByBrowser(events, filters.browser);
  }
  if (filters.search) {
    events = filterBySearchValue(events, filters.search);
  }
  let more = false;
  if (filters.offset) {
    events = events.slice(0, filters.offset);
    more = true;
  }
  const obj = { events, more };
  return obj;
};

// gets an array of event with full date and time: dd/mm/yy hh:mm 
// returns only the events from a specific date
export const getAllSessionFromDate = (filterDate: string): Event[] => {
  let events: Event[] = getAllEvents();
  sortByDate(events, '+');
  events = getAllEventsWithNormalDateTime(events);
  events = events.filter((e: Event) => {
    if(typeof e.date === "string"){
      const currentEventDate = e.date.split(',')[0];
      return currentEventDate === filterDate;
    }
    else{
      return false;
    } 
  });
  return events;
}

export const getSessionsByDays = (): DayAndSessionCount[] => {
  let events: Event[] = getAllEvents();
  sortByDate(events, '+');
  events = getAllEventsWithNormalDates(events);
  const sessionByDay: DayAndSessionCount[] = getEventsDitsinctByDay(events);
  return sessionByDay;
}

export const getRetentionCohort = (dayZero:number) : weeklyRetentionObject[] => {
  let retention:weeklyRetentionObject[] = []; 
  let startDate:number = new Date (new Date(dayZero).toDateString()).getTime();
  let endDate:number = startDate + OneWeek; 
  let now:number = new Date (new Date().toDateString()).getTime();
  let index:number = 0;
  while(startDate <= now){
    let newUsers = getUsersIds(startDate, endDate, "signup");
    let rObj: weeklyRetentionObject = {
      registrationWeek: index, 
      newUsers: newUsers.length, 
      weeklyRetention: getWeeklyRetention(startDate, endDate, newUsers, now), // helper function getWeeklyRetention: number[]
      start: msToDate(startDate),
      end: msToDate(endDate)
    } 
    retention.push(rObj);
    startDate = endDate;
    endDate = startDate + OneWeek;
    index++;
  }
  return retention;
}
// gets the number of new users or logins between 2 dates
export const getSignUpOrLogInCount = (daysAndSessions: DayAndSessionCount[], startDate: string, endDate: string, signUpOrLogin: "signUpCount" | "loginCount"): number => {
  const startDay = parseInt(startDate.split('/')[0]);
  const endDay = parseInt(endDate.split('/')[0]);
  const startIndex:number = startDay - 1;
  const endIndex:number = endDay; // going to use it for slice, so dont need to -1
  const arrSection = daysAndSessions.slice(startIndex, endIndex);
  let count:number = 0;
  signUpOrLogin === "signUpCount" ? 
  arrSection.forEach((day: DayAndSessionCount) => count += day.signUpCount) : arrSection.forEach((day: DayAndSessionCount) => count += day.loginCount);
  return count;
}


// recives a start date and returns the end date, handling the half week scenarios
export const getEndDate = (startDate: string): string => {//  24/10/2020
  const startDay:number = parseInt(startDate.split('/')[0]); //24
  const startMonth:string = startDate.split('/')[1] //10
  const startYear:string = startDate.split('/')[2] //2020 
  const endDay:number = startDay + 7 > 30 ? 30 : startDay + 7;
  const endDate:string = `${endDay}/${startMonth}/${startYear}`;
  console.log(`new endDate is: ${endDate}`);
  return endDate;
}

export const getWeeklyRetention = (startDate: number, endDate: number, newUsers: string[], currentTime:number): number[] => {
  let retention:number[] = [100];
  startDate = endDate;
  endDate = startDate + OneWeek;
  while(startDate <= currentTime){
    let loggedUsers:string[] = getUsersIds(startDate, endDate, "login");
    const validatedUsers:string[] = loggedUsers.filter((user: string) => newUsers.includes(user));
    let percant:number = Math.round((validatedUsers.length / newUsers.length) * 100);
    retention.push(percant);
    startDate = endDate;
    endDate += OneWeek;
  }
  return retention;
}

export const getUsersIds = (startDate: number, endDate: number, byEvent: "login" | "signup"): string[] => {
  let events: Event[] = getAllEvents();
  sortByDate(events, '+');
  events = events.filter((e: Event) => 
    (e.date as number >= startDate &&
     e.date as number <= endDate &&
     e.name === byEvent));
  let userIds: string[] = [];
  events.forEach((e: Event) =>{
    if(userIds.includes(e.distinct_user_id) === false){
      userIds.push(e.distinct_user_id);
    }
  })
  return userIds;
}

export const getBrowsersCount = ():BrowserCount[] => {
  const events:Event[] = getAllEvents();
  const browsers:BrowserCount[] = [
    {
      browser:"chrome",
      count:0
    },
    {
      browser:"safari",
      count:0
    },
    {
      browser:"edge",
      count:0
    },
    {
      browser:"firefox",
      count:0
    },
    {
      browser:"ie",
      count:0
    },
    {
      browser:"other",
      count:0
    }];
  events.forEach((e:Event) => {
    for(let i = 0; i < browsers.length;i++){
      if(browsers[i].browser === e.browser){
        browsers[i].count++;
      }
    }
  })
  return browsers;
}
export const getBrowserDistribution = (browserAndCount:BrowserCount[]):BrowserDistribution[] => {
  const total = getAllEvents().length;
  const browsersDistribution: BrowserDistribution[] = browserAndCount.map((bAndCount: BrowserCount) =>{
    const percent = Math.round(bAndCount.count / total * 100);
    let currentBrowser: BrowserDistribution = {browser: bAndCount.browser, percent};
    return currentBrowser;
  })
  return browsersDistribution;
}
// export const getPaths = (n:number, endNode:number[]): Array<number[]> => {
//   let paths:Array<number[]> = [];
//   let arr = [];
//   for(let i = 1; i < n + 1; i++){
//       arr.push(i);
//   }
//   for (let j = 0; j < endNode.length - 1; j++) {
//       let startValue = endNode[j]; // 1
//       let endValue = endNode[j + 1];// 3
//       let newPath = [];
//       let currentIndex = startValue - 1;
//       while(arr[currentIndex] !== endValue) {
//           newPath.push(arr[currentIndex]);
//           currentIndex++;
//           if(currentIndex === arr.length){
//               currentIndex = 0;
//           }
//       }     
//       newPath.push(endValue);  
//       paths.push(newPath);
//   }
//   return paths;
// }

// export const mostRecurringValue = (arr: Array<number[]>):number => {
//   const flatArr = arr.flat();
//   let counterArr: number[][] = new Array(Math.max(...flatArr));
//     for (let i = 0; i < flatArr.length; i++) {
//       let currentValue = flatArr[i];
//       let valueArr = flatArr.filter(value => value === currentValue)
//       counterArr[i] = [currentValue, valueArr.length];
//   }
//   let recurringValue:number = 0;
//   let maxCount = 0;
//   for (let j = 0; j < counterArr.length; j++) {
//     if(counterArr[j][1] > maxCount){
//       recurringValue = counterArr[j][0];
//       maxCount = counterArr[j][1];
//     }
//   }
//   return recurringValue;
// }