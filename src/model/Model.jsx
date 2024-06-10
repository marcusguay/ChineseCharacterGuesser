import React from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import RequestController from "../controllers/RequestController";

var charJson = require("./chinesechars.json");

class Model {
  constructor() {
    this.state = {
      model: null,
      charMapping: charJson.array,
      modelLoaded: false,
    };
    console.log(charJson);
  }
  


  async loadModel() {
    try {
      const newModel = await tf.loadLayersModel(
        "https://chinesecharactermodel.b-cdn.net/large_model/model.json"
      );
      this.state = {
        model: newModel,
        charMapping: this.state.charMapping,
        modelLoaded: true,
      };
      console.log("Done loading model");
    } catch (e) {
      console.log(e);
    }
  }

  async localPrediction(file) {
    return new Promise(async (resolve, reject) => {
      tf.engine().startScope();

      const tensor = tf.browser.fromPixels(file, 1).expandDims();
      var predictions = await this.state.model.predict(tensor);
      predictions = predictions.reshape([7186]);
      var array = await predictions.data();

      var i = 0;
      var map = {};

      array.forEach((element) => {
        map[element] = i;
        i++;
      });

      array = array.sort((a, b) => b - a);
      array = array.slice(0, 9);
      array = array.map((i) => {
        return map[i];
      });

      tf.engine().endScope();
      resolve(array);
    });
  }

  applyMapping(array) {
    const response = [];
    array.forEach((i) => {
      response.push(this.state.charMapping[i]);
    });

    console.log(response);
    return response;
  }

  isModelLoaded() {
    return this.state.modelLoaded;
  }

  hasMapping(){
    return this.state.charMapping != null;
  }
}

export default Model;
