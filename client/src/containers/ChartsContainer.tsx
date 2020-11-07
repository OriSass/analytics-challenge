import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const ChartsContainer: React.FC = () => {
  return (
    <>
    </>
  );
};

export default ChartsContainer;
