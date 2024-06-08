import React from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import RequestController from "../controllers/RequestController";

class Model {
  constructor() {
    this.state = {
      model: null,
      charMapping: null,
      modelLoaded: false,
    };

    this.loadCharMapping();
    this.loadModel();
  }

  async loadCharMapping() {
    try {
      const req = await RequestController.loadCharData();
      console.log("mapping loaded");
      const mapping = await req.json();
      console.log(mapping);
      this.state = {
        model: this.state.model,
        charMapping: mapping,
        modelLoaded: this.state.modelLoaded,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async loadModel() {
    try {
      const newModel = await tf.loadLayersModel(
        "https://tensorflowjsmodel.b-cdn.net/model.json"
      );
      this.state = {
        model: newModel,
        charMapping: this.state.charMapping,
        modelLoaded: true,
      };
      console.log("done loading model");
      console.log(newModel);
      console.log(newModel.summary());
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
}

export default Model;
