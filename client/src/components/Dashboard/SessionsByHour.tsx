import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import axios from "axios";
import { DayAndSessionCount } from '../../models/event';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "./Dashboard.css"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }),
); 

require('dotenv').config(); 


const SessionByDay: React.FC = () => {
    const [sessions, setSessions] = useState<DayAndSessionCount[]>();
    const [chosenDate, setChosenDate] = useState<Date>();

    useEffect(() => {
        fetchSessionData(0);
    },[])

    useEffect(() => {
      if(chosenDate){
        let now:Date = new Date();
        let offset:number = 30 - (chosenDate as Date).getDate(); 
        console.log(offset);
        
        fetchSessionData(offset);
      }
    },[chosenDate])
    
 

  const fetchSessionData = async(offset:number) => {
      const {data} = await axios.get(`http://localhost:3001/events/by-hours/${offset}`);  
      setSessions(data);
  }
  
 
  const classes = useStyles();
  return ( 
    <div className="dashboard-item">
        <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="Date"
          type="date"
          defaultValue="2020-10-30"
          className={classes.textField}
          onChange={({ target }) => {
            console.log(target.value);
            let weirdDate = target.value;
            let year:number = parseInt(weirdDate.split("-")[0]);
            let month:number = parseInt(weirdDate.split("-")[1]);
            let day:number = parseInt(weirdDate.split("-")[2]); 
            let newDate = new Date(year, month, day);
            setChosenDate(newDate);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
      <LineChart width={730} height={250} data={sessions}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis dataKey="count" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart>   
  </div>
  )

  };

export default SessionByDay;