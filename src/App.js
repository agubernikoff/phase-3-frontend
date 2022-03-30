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
import { colors } from "@mui/material";

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
function formatAppt(jsonObj) {
  const formatted = {startDate: jsonObj.startDate,
    endDate: jsonObj.endDate,
    title: jsonObj.task_def.title,
    id: jsonObj.id
    //"[propertyName: 'category:']": json.task_def.category,
    //"priority": json.task_def.priority
    //description: json.task_def.description,
    };
  return formatted;
}



function App() {
  //state variables
  const [taskTimes, setTaskTimes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:9292/task_times")
      .then((r) => r.json())
      .then((tasks) => {
        const formatArr = tasks.map((t) => formatAppt(t))
        setTaskTimes(formatArr)
      });
      
  }, []);

  function onEdit (e) {
    console.log(e)
    //call function to update an existing appointment
    if (Object.keys(e)[0]=== "changed") {
      console.log("yay changed")
      patchAppt(e.changed)
    }
    //call function to delete appointment
    if (Object.keys(e)[0]=== "deleted") {
      console.log(e.deleted)
      //commented out because this function isn't complete or tested
      deleteAppt(e.deleted)
    }
    //call function to post new appointment
    if (Object.keys(e)[0]=== "added") {
      console.log(e.added)
      //commented out because this function isn't complete or tested
      postAppt(e.added)
    }
  }

  function deleteAppt(id) {
    fetch(`http://localhost:9292/task_times/${id}`, {
      method: "DELETE",
    })
    .then((r) => r.json())
    .then((json) => {
      const filtered = taskTimes.filter((task) => task.id!==id);
      setTaskTimes(filtered);
    });
  }

  function patchAppt(eObj) {
    const id = Object.keys(eObj)[0];
    console.log(eObj[id]);
    fetch(`http://localhost:9292/task_times/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eObj[id])
    })
    .then((r) => r.json())
    .then((json) => { 
      const updated = formatAppt(json);
      console.log("updated:", updated)
      const updatedArr = taskTimes.map((task) => {
        console.log("taskid=",task.id, 'id=', id);
        if (task.id == id) {
          console.log("in if???")
          return updated;
        }
        return task;
      });
      console.log(updatedArr);
      setTaskTimes(updatedArr);
    });   
  };

  function postAppt(eObj) {
    fetch("http://localhost:9292/task_times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: eObj.title,
        startDate: eObj.startDate,
        endDate: eObj.endDate
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        console.log(json);
        const newAppt = formatAppt(json);
        console.log(newAppt);
        setTaskTimes([...taskTimes, newAppt]);
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
          <AppointmentTooltip showOpenButton showDeleteButton />
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
