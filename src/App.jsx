import Canvas from "./ui/Canvas";
import "./App.css";
import { Component, useRef } from "react";
import CustomPanel from "./ui/CustomPanel";
import React from "react";
import { Container } from "@mui/material";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Controller from "./controllers/Controller";

console.log(tf.version);

class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controller: new Controller(),
    };
  }

  render() {
    return (
      <div
        className="MyApp"
        style={{
          display: "flex",
          backgroundColor: "#30475E",
          maxHeight: "100vh",
        }}
      >
        <Container>
          {" "}
          <Canvas props={{ controller: this.state.controller }}> </Canvas>{" "}
        </Container>
        <CustomPanel props={{ controller: this.state.controller }} />
      </div>
    );
  }
}

export default MyApp;
