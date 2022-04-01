import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  AllDayPanel,
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
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./App.css";
import DateTime from "./DateTime";
import { colors } from "@mui/material";
import { RRule, RRuleSet, rrulestr } from "rrule";
import { style } from "@mui/system";
import PriorityGuide from "./PriorityGuide";

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
function renderCategory(category) {
  switch (category) {
    case 1:
      return "Focused Work";
    case 2:
      return "Being a Human";
    case 3:
      return "Outdoor Activity";
    case 4:
      return "Hobby";
    case 5:
      return "Socializing";
    case 6:
      return "Learning";
    case 7:
      return "Physical Activity";
    default:
      return "nothings";
  }
}
function formatAppt(json) {
  console.log("json passed to formatappt:", json);
  let formattedArr = [];
  for (let i = 0; i < json.length; i++) {
    for (let j = 0; j < json[i].task_times.length; j++) {
      console.log("in inner for loop");
      const objToPush = {
        startDate: json[i].task_times[j].startDate,
        endDate: json[i].task_times[j].endDate,
        title: json[i].title,
        id: json[i].task_times[j].id,
        allDay: !!json[i].task_times[j].allDay,
        task_def_id: json[i].id,
        //"[propertyName: 'category:']": json.task_def.category,
        priority: json[i].priority_id,
        rRule: json[i].rRule,
        category: renderCategory(json[i].category_id),
        description: json[i].description,
      };
      console.log("objToPush:", objToPush);
      formattedArr.push(objToPush);
    }
  }
  console.log("formatted array!!!!!", formattedArr);
  return formattedArr;
}

function App() {
  //state variables
  const [taskTimes, setTaskTimes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:9292/task_times")
      .then((r) => r.json())
      .then((tasks) => {
        const formatArr = formatAppt(tasks);
        console.log("formatAArr:", formatArr);
        setTaskTimes(formatArr);
      });
  }, []);

  function onEdit(e) {
    console.log(e);
    //call function to update an existing appointment
    if (Object.keys(e)[0] === "changed") {
      console.log("yay changed");
      patchAppt(e.changed);
    }
    //call function to delete appointment
    if (Object.keys(e)[0] === "deleted") {
      console.log(e.deleted);
      //commented out because this function isn't complete or tested
      deleteAppt(e.deleted);
    }
    //call function to post new appointment
    if (Object.keys(e)[0] === "added") {
      // if (e.added.rRule) {
      //   console.log(e.added);
      //   //invoke rrulstr on correctly formatted startDate + rRule to create a new rRule obj.
      //   //invoke .all() to get every instance of the recurring event.
      //   // map over that to correctly format the date.
      //   // map over that to return an appropriately formatted task object
      //   // CHECK CONSOLE AFTER CREATING A NEW TASK TO SEE RESULTS
      //   const recurringDates = rrulestr(
      //     `DTSTART:${e.added.startDate
      //       .toISOString()
      //       .replace(/[^a-zA-Z0-9 ]/g, "")
      //       .slice(0, -4)}Z\n${e.added.rRule}`.toString()
      //   )
      //     .all()
      //     .map((date) => date.toISOString())
      //     .map((date) => ({
      //       startDate: date,
      //       endDate:
      //         date.slice(0, 11) + e.added.endDate.toISOString().slice(11),
      //       title: e.added.title,
      //       // allDay: e.added.allDay,
      //       // rRule: e.added.rRule,
      //     }));
      //   const objToPost = { ...e.added, recurringDates: recurringDates };
      //   postAppt(objToPost);
      //   // for (let i = 0; i < recurringDates.length; i++) {
      //   //   postAppt(recurringDates[i]);
      //   // }
      //   // setTimeout(() => setTaskTimes([...taskTimes, ...recurringDates]), 300);
      // }
      //commented out because this function isn't complete or tested
      postAppt(e.added);
    }
  }

  function deleteAppt(id) {
    fetch(`http://localhost:9292/task_times/${id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((json) => {
        const filtered = taskTimes.filter((task) => task.id !== id);
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
      body: JSON.stringify(eObj[id]),
    })
      .then((r) => r.json())
      .then((json) => {
        const updated = formatAppt(json);
        console.log("updated:", updated);
        const updatedArr = taskTimes.map((task) => {
          console.log("taskid=", task.id, "id=", id);
          if (task.id == id) {
            console.log("in if???");
            return updated;
          }
          return task;
        });
        console.log(updatedArr);
        setTaskTimes(updatedArr);
      });
  }

  function postAppt(eObj) {
    console.log(eObj);
    fetch("http://localhost:9292/task_times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eObj),
    })
      .then((r) => r.json())
      .then((json) => {
        const newAppt = formatAppt([json]);
        console.log("post new appt return", newAppt);
        setTaskTimes([...taskTimes, ...newAppt]);
      });
  }
  console.log(taskTimes);

  function renderPriority(priority) {
    switch (priority) {
      case 1:
        return {
          ...style,
          backgroundColor: "#B8ACC8",
          borderColor: "#D7483F",
          borderWidth: 10,
        };
      case 2:
        return {
          ...style,
          backgroundColor: "#B8ACC8",
          borderColor: "#D7883F",
          borderWidth: 10,
        };
      case 3:
        return {
          ...style,
          backgroundColor: "#B8ACC8",
          borderColor: "#EEE839",
          borderWidth: 10,
        };
      case 4:
        return {
          ...style,
          backgroundColor: "#B8ACC8",
          borderColor: "#43DE35",
          borderWidth: 10,
        };
      case 5:
        return {
          ...style,
          backgroundColor: "#B8ACC8",
          borderColor: "#3550DE",
          borderWidth: 10,
        };
      default:
        return { ...style, backgroundColor: "#B8ACC8" };
    }
  }

  const Appointment = ({ data, children, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={renderPriority(data.priority)}
    >
      {children}
      <h4 style={{ color: "black", textAlign: "center" }}>
        <strong>Category:</strong> {data.category}
      </h4>
      <p style={{ color: "black", textAlign: "center" }}>
        <strong>Description:</strong> {data.description}
      </p>
    </Appointments.Appointment>
  );

  return (
    <div className="App">
      <header className="App-header"></header>
      <DateTime />
      <PriorityGuide />
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
          <AllDayPanel />
          <Appointments appointmentComponent={Appointment} />
          <EditingState onCommitChanges={onEdit} />
          <EditRecurrenceMenu />
          <AppointmentTooltip
            showOpenButton
            showDeleteButton
            children={<h1>o</h1>}
          />
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
