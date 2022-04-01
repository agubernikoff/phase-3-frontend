import React from "react";

function PriorityGuide() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <h1>PriorityGuide</h1>
      <br></br>
      <div
        style={{
          backgroundColor: "#D7483F",
          borderWidth: 2,
          width: 75,
          height: 35,
          textAlign: "center",
          paddingTop: 2,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#B8ACC8",
            borderWidth: 2,
            width: 65,
            height: 25,
            marginLeft: 4,
            marginTop: 5,
          }}
        >
          Urgent
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#D7883F",
          borderWidth: 2,
          width: 75,
          height: 35,
          textAlign: "center",
          paddingTop: 2,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#B8ACC8",
            borderWidth: 2,
            width: 65,
            height: 25,
            marginLeft: 4,
            marginTop: 5,
          }}
        >
          High
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#EEE839",
          borderWidth: 2,
          width: 75,
          height: 35,
          textAlign: "center",
          paddingTop: 2,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#B8ACC8",
            borderWidth: 2,
            width: 65,
            height: 25,
            marginLeft: 4,
            marginTop: 5,
          }}
        >
          Medium
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#43DE35",
          borderWidth: 2,
          width: 75,
          height: 35,
          textAlign: "center",
          paddingTop: 2,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#B8ACC8",
            borderWidth: 2,
            width: 65,
            height: 25,
            marginLeft: 4,
            marginTop: 5,
          }}
        >
          Low
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#3565DE",
          borderWidth: 2,
          width: 75,
          height: 35,
          textAlign: "center",
          paddingTop: 2,
          margin: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#B8ACC8",
            borderWidth: 2,
            width: 65,
            height: 25,
            marginLeft: 4,
            marginTop: 5,
          }}
        >
          Optional
        </div>
      </div>
    </div>
  );
}

export default PriorityGuide;
