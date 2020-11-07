import React, {useState, useEffect} from 'react'
import {
    PieChart, Pie, Sector, Cell,
  } from 'recharts';
import axios from "axios";
import { DayAndSessionCount } from '../../models/event';
require('dotenv').config(); 


const BrowserPieChart: React.FC = () => {
    const [sessions, setSessions] = useState<DayAndSessionCount[]>();
    const [chosenDate, setChosenDate] = useState<string>();

    useEffect(() => {
        fetchSessionData();
    },[])
    
 

  const fetchSessionData = async() => {
      const {data} = await axios.get('http://localhost:3001/events/by-days/0');
      setSessions(data);
  }
  const colors = ["#87aa28","#e9a846","#e48e54","#87aa28","#6074cf","#6074cf", "#ca8dca"];
 
//"#8884d8
      
  return ( 
      sessions ?
        <PieChart width={730} height={250}>
        {/* <Pie data={sessions}
             dataKey="percent" nameKey="browser"
             cx="50%" cy="50%" outerRadius={50} label/> 
                    {sessions.map((b:BrowserDistribution, index:number) =>
                     <Cell key={`cell-${index}`} fill={colors[index]}/>
                     )}            */}
        </PieChart> : <></>    
  )

  };

export default BrowserPieChart;