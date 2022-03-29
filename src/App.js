import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  Toolbar,
  WeekView,
  MonthView,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./App.css";
import DateTime from "./DateTime";

// Get current date and format it correctly (YYYY-MM-DD)
const date = new Date();
function formatMonth(month) {
  console.log(month);
  if (month > 10) return month;
  else return "0" + month;
}
const currentDate = `${date.getFullYear()}-${formatMonth(
  date.getMonth() + 1
)}-${date.getDate()}`;

const schedulerData = [
  {
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
  },
  {
    startDate: "2018-11-01T12:00",
    endDate: "2018-11-01T13:30",
    title: "Go to the gym",
  },
];

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <DateTime />
      <Paper>
        <Scheduler data={schedulerData}>
          <ViewState
            defaultCurrentDate={currentDate}
            defaultCurrentViewName="Week"
          />
          <DayView startDayHour={0} endDayHour={24} />
          <WeekView startDayHour={0} endDayHour={24} />
          <MonthView startDayHour={0} endDayHour={24} />
          <Toolbar />
          <ViewSwitcher />
          <Appointments />
        </Scheduler>
      </Paper>
    </div>
  );
}

export default App;
