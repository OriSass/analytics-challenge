import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import GoogleMapEvents from "../components/Dashboard/GoogleMapEvents";
import RetentionCohort from "../components/Dashboard/RetentionCohort";
import BrowserPieChart from "../components/Dashboard/BrowserPieChart";
import SessionByDay from "../components/Dashboard/SessionByDay";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
    <GoogleMapEvents />
    <RetentionCohort />
    <BrowserPieChart />
    <SessionByDay />
    </>
  );
};

export default DashBoard;
