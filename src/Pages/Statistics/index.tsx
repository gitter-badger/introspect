// React Imports
import React, { FC, useState } from "react";
import moment from "moment";
//@ts-expect-error Does not have types
import csvDownload from "json-to-csv-export";
import { NoResponses } from "./Components";
import { SmallIcon } from "../../Components/Reusable";
import { Page } from "../../Components/Loading";
import { createUnixDate } from "../../Utils/funcs";

import Ratings from "./Ratings";
import Descriptions from "./Descriptions";
import Reflections from "./Reflections";

// Redux Imports
import { useSelector } from "react-redux";
import {
  getEndDate,
  getProfileLoaded,
  getSortedResponses,
  getStartDate,
  setEndDate,
  setStartDate,
  useAppDispatch,
} from "../../Redux";

// Material UI Imports
import { Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { GetApp } from "@material-ui/icons";
import { ParsableDate } from "@material-ui/pickers/constants/prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  heading: {
    position: "relative",
  },
  dateWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(1, 0),
  },
  dateSeperator: {
    margin: theme.spacing(0, 2),
    fontSize: "1rem",
  },
  date: {
    maxWidth: 145,
  },
}));

interface StatisticsProps {}

const Statistics: FC<StatisticsProps> = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const realStartDate = new Date(createUnixDate(useSelector(getStartDate)));
  const realEndDate = new Date(createUnixDate(useSelector(getEndDate)));

  const [tempStartDate, setTempStartDate] = useState<ParsableDate>(
    realStartDate
  );

  const [tempEndDate, setTempEndDate] = useState<ParsableDate>(realEndDate);

  const isLoaded = useSelector(getProfileLoaded);
  const responses = useSelector(getSortedResponses);

  const responseLength = responses ? Object.keys(responses).length : 0;

  return (
    <>
      <div className={classes.heading}>
        <Typography variant="h4" align="center">
          Statistics
        </Typography>
        <SmallIcon
          icon={<GetApp fontSize="small" />}
          title="Export as CSV"
          IconButtonProps={{
            onClick: () => {
              csvDownload(
                Object.entries(responses).map(([date, response]) => ({
                  date: moment(date, "DD-MM-YYYY").format("MM/DD/YYYY"),
                  ...response,
                })),
                `introspect_${moment(realStartDate).format(
                  "MM-DD-YYYY"
                )}_to_${moment(realEndDate).format("MM-DD-YYYY")}.csv`
              );
            },
            disabled: !responseLength,
          }}
        />
      </div>
      <div className={classes.dateWrapper}>
        <KeyboardDatePicker
          placeholder="11/26/2008"
          value={tempStartDate}
          onChange={(date) => {
            if (date && date.isValid() && date.isSameOrBefore(realEndDate)) {
              dispatch(setStartDate(date.format("DD-MM-YYYY")));
            }
            setTempStartDate(date);
          }}
          format="MM/DD/YYYY"
          className={classes.date}
          disableFuture={true}
          maxDate={realEndDate}
          maxDateMessage="Start Date should not be after End Date"
          minDateMessage="Start Date should not be before minimum date"
        />
        <span className={classes.dateSeperator}>to</span>
        <KeyboardDatePicker
          placeholder="11/26/2008"
          value={tempEndDate}
          onChange={(date) => {
            if (
              date &&
              date.isValid() &&
              date.isSameOrBefore(new Date()) &&
              date.isSameOrAfter(realStartDate)
            ) {
              dispatch(setEndDate(date.format("DD-MM-YYYY")));
            }
            setTempEndDate(date);
          }}
          format="MM/DD/YYYY"
          className={classes.date}
          disableFuture={true}
          minDate={realStartDate}
          minDateMessage="End Date should not be before Start Date"
          maxDateMessage="End Date should not be in the future"
        />
      </div>
      {!isLoaded ? (
        <Page />
      ) : !responseLength ? (
        <NoResponses />
      ) : (
        <>
          <Ratings responses={responses} />
          <Descriptions responses={responses} />
          <Reflections responses={responses} />
        </>
      )}
    </>
  );
};

export default Statistics;
