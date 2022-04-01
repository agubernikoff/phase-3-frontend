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
  //AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  ConfirmationDialog,
} from "@devexpress/dx-react-scheduler-material-ui";
import "./App.css";
import DateTime from "./DateTime";
import { style } from "@mui/system";
import PriorityGuide from "./PriorityGuide";

// Get current date and format it correctly (YYYY-MM-DD)
const date = new Date();
function formatMonth(month) {
  if (month > 10) return month;
  else return "0" + month;
}
const currentDate = `${date.getFullYear()}-${formatMonth(
  date.getMonth() + 1
)}-${date.getDate()}`;

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
  let formattedArr = [];
  for (let i = 0; i < json.length; i++) {
    for (let j = 0; j < json[i].task_times.length; j++) {
      const objToPush = {
        startDate: json[i].task_times[j].startDate,
        endDate: json[i].task_times[j].endDate,
        title: json[i].title,
        id: json[i].task_times[j].id,
        allDay: !!json[i].task_times[j].allDay,
        task_def_id: json[i].id,
        priority: json[i].priority_id,
        rRule: json[i].rRule,
        exDate: json[i].exDate,
        category: json[i].category_id,
        description: json[i].description,
      };
      formattedArr.push(objToPush);
    }
  }
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
        setTaskTimes(formatArr);
      });
  }, []);

  function onEdit(e) {
    //call function to update an existing appointment
    if (Object.keys(e).includes("changed")) {
      patchAppt(e.changed);
    }
    //call function to delete appointment
    if (Object.keys(e)[0] === "deleted") {
      deleteAppt(e.deleted);
    }
    //call function to post new appointment
    if (Object.keys(e).includes("added")) {
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
    fetch(`http://localhost:9292/task_times/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eObj[id]),
    })
      .then((r) => r.json())
      .then((json) => {
        const updated = formatAppt([json]);
        const updatedArr = taskTimes.map((task) => {
          if (task.id == id) {
            return updated[0];
          }
          return task;
        });
        setTaskTimes(updatedArr);
      });
  }

  function postAppt(eObj) {
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
        setTaskTimes([...taskTimes, ...newAppt]);
      });
  }

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
      <p style={{ color: "black", textAlign: "center" }}>
        <strong>Category:</strong> {renderCategory(data.category)}
      </p>
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
          {/* <AppointmentTooltip showOpenButton /> */}
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
