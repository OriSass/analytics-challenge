export interface Event {
  _id: string;
  session_id: string;
  name: eventName;
  url: string;
  distinct_user_id: string;
  date: number | string; //number for ms and string for dd/mm/yyyy hh:mm
  os: os;
  browser: browser;
  geolocation: GeoLocation;
}

export interface weeklyRetentionObject {
  registrationWeek:number;
  newUsers:number;
  weeklyRetention:number[];
  start:string;
  end:string
}

export type eventName = "login" | "signup" | "admin" | "/";
export type os = "windows" | "mac" | "linux" | "ios" | "android" | "other";
export type browser = "chrome" | "safari" | "edge" | "firefox" | "ie" | "other";
export type GeoLocation = {
  location: Location;
  accuracy: number;
};
export type Location = {
  lat: number;
  lng: number;
};
export interface RetentionCohort {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

export interface Filter {
  sorting: string;
  type: eventName;
  browser: browser;
  search: string;
  offset: number;
}
export interface Database{
  events: Event[];
}
export interface DayAndSessionCount{
  date:string, 
  signUpCount:number,
  loginCount:number,
  count: number // = signUpCount + loginCount
}
export interface HourAndSessionCount{
  hour:string, 
  count: number
}

export interface FilteredEvents{
  events: Event[],
  more: boolean
}

export interface DaySummary{
  date: string,
  signUpCount:number,
  loginCount:number
}

export type value = string | number | eventName | os | GeoLocation | browser;
