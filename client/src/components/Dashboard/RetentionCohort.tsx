import React, {useState, useEffect} from "react";
import axios from "axios";
import { weeklyRetentionObject } from '../../models/event';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';
import "./Dashboard.css";

const DashBoard: React.FC = () => {

    const [retention, setRetention] = useState<weeklyRetentionObject[]>();

    useEffect(()=> {
        getRetention();
    },[])

    const getRetention = async() => {
        let dayZero = 1601697600000;
        const {data} = await axios.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`);
        setRetention(data);
        console.log(data);
    }


const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const renderRetention = () => {
  return (
    <TableContainer component={Paper} className="dashboard-item">
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
          <StyledTableCell></StyledTableCell>
              {retention?.map((week: weeklyRetentionObject, index: number) => {
                  return <StyledTableCell>Week {index}</StyledTableCell>
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {retention?.map((week: weeklyRetentionObject, index:number) => (
            <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                    <p>Week {index}</p>
                    <p>New Users: {week.newUsers}</p>
                </StyledTableCell>
                {week.weeklyRetention.map((percent:number) => {
                    return(
                    <StyledTableCell component="th" scope="row">
                    {percent === null ? 0 : (percent)}%
                  </StyledTableCell>);
                })}
              </StyledTableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

  return (
      retention ? renderRetention():
    <>
    </>
  );
};

export default DashBoard;
