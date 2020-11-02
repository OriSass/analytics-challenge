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
  Database,
  Filter,
  FilteredEvents,
} from "../../client/src/models/event";
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
  events.forEach((e: Event) => {
    const dateObj = new Date(e.date);
    const dateAndHour: string = dateObj.toLocaleString("en-US", { timeZoneName: "short" }); // FORMAT: MM/DD/YYYY, 10:30:15 AM CST
    const wierdDate: string = dateAndHour.split(",")[0];
    const day = wierdDate.split("/")[1];
    const month = wierdDate.split("/")[0];
    const year = wierdDate.split("/")[2];
    e.date = `${day}/${month}/${year}`;
  });
  return events;
};
// return an array of dates and the number of sessions in each day
export const getEventsDitsinctByDay = (events: Event[]): DayAndSessionCount[] => {
  const eByDays: DayAndSessionCount[] = [];
  events.forEach((e: Event) => {
    if (eByDays.length > 0) {
      let index: number = 0;
      const exists = eByDays.some((element: DayAndSessionCount, i: number) => {
        if (element.date === e.date) {
          index = i;
          return true;
        }
        return false;
      });
      if (exists) {
        eByDays[index].count++;
      } else {
        eByDays.push({ date: e.date as string, count: 1 });
      }
    } else {
      eByDays.push({ date: e.date as string, count: 1 });
    }
  });
  return eByDays;
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
        if (typeof value !== "object") {
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
