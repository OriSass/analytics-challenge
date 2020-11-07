import React, {useState, useEffect} from "react";
import axios from "axios";
//import {OneHour, OneDay, OneWeek} from '../../../../server/backend/timeFrames'


const DashBoard: React.FC = () => {

    const [retention, SetRetention] = useState();

    useEffect(()=> {
        getRetention();
    },[])

    const getRetention = async() => {
        // dayZero like the tests
        // const today = new Date (new Date().toDateString()).getTime()+6*OneHour
        // const dayZero = today-5*OneWeek
        // const data = await axios.get(`http://localhost:3001/retention?dayZero=${dayZero}`);
        // console.log(data);
    }
  return (
    <>
    RETENTION
    </>
  );
};

export default DashBoard;
