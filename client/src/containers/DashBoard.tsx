import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import GoogleMapEvents from "../components/Dashboard/GoogleMapEvents";
import RetentionCohort from "../components/Dashboard/RetentionCohort";
import BrowserPieChart from "../components/Dashboard/BrowserPieChart";
import SessionByDay from "../components/Dashboard/SessionByDay";
import SessionsByHour from "../components/Dashboard/SessionsByHour";
import "../components/Dashboard/Dashboard.css";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div className="dashboard-container">
    <GoogleMapEvents />
    <RetentionCohort />
    <BrowserPieChart /> 
     <SessionByDay />
    <SessionsByHour />
    </div>
  );
};

export default DashBoard;
