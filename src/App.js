import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  DateNavigator,
  Appointments,
  Toolbar,
  WeekView,
  MonthView,
  ViewSwitcher,
  //IntegratedEditing,
  EditRecurrenceMenu,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  ConfirmationDialog
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



// const schedulerData = [
//   {
//     startDate: "2018-11-01T09:45",
//     endDate: "2018-11-01T11:00",
//     title: "Meeting",
//   },
//   {
//     startDate: "2018-11-01T12:00",
//     endDate: "2018-11-01T13:30",
//     title: "Go to the gym",
//   },
//   {
//     startDate: "2022-04-01T12:00",
//     endDate: "2022-04-01T13:30",
//     title: "Finish the Project",
//   },
//   {
//     startDate: "2022-03-31T22:00",
//     endDate: "2022-04-01T08:00",
//     title: "Sleep",
//   },
// ];
function formatAppt(jsonArr) {
  const formatted = jsonArr.map((json) => {
    return {startDate: json.start,
    endDate: json.end,
    title: json.task_def.title,
    id: json.id
    //"[propertyName: 'category:']": json.task_def.category,
    //"priority": json.task_def.priority
    //description: json.task_def.description,
    }
  });
  return formatted;
}
function onEdit (e) {
  console.log(e)
  //call function to update an existing appointment
  if (Object.keys(e)[0]=== "changed") {
    console.log("yay changed")
  }
  //call function to delete appointment
  if (Object.keys(e)[0]=== "deleted") {
    console.log(e.deleted)
    //commented out because this function isn't complete or tested
    //deleteAppt(e.deleted)
  }
  //call function to post new appointment
  if (Object.keys(e)[0]=== "added") {
    console.log(e.added)
    //commented out because this function isn't complete or tested
    //postAppt(e.added)
  }
}


function App() {
  //state variables
  const [taskTimes, setTaskTimes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:9292/task_times")
      .then((r) => r.json())
      .then((tasks) => {
        setTaskTimes(formatAppt(tasks))
      });
      
  }, []);

  function deleteAppt(id) {
    fetch(`http://localhost:9292/task_times/${id}`, {
      method: "DELETE",
    });
  }

  function postAppt(eObj) {
    fetch("http://localhost:9292/task_times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: eObj.title,
      }),
    })
      .then((r) => r.json())
      .then((tasks) => {
        console.log(tasks)
      });
  }  

  return (
    <div className="App">
      <header className="App-header"></header>
      <DateTime />
      <Paper>
        <Scheduler data={taskTimes}>
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
          <EditingState onCommitChanges={onEdit} />
          <EditRecurrenceMenu />
          <AppointmentTooltip />
          <AppointmentForm />
          <DragDropProvider />
          <ConfirmationDialog />
          <DateNavigator />
        </Scheduler>
      </Paper>
    </div>
  );
}

export default App;
