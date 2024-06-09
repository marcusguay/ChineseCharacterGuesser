import React from "react";
import Model from "../model/Model";
import RequestController from "./RequestController";
import { Component } from "react";
var model = new Model();

var updateCustomPanel = null;

class Controller {
  constructor() {
    this.loaded = false;
    this.ready = false;
    this.charData = [];
    this.queryResults = [];

    this.createModel();
  }

  async createModel() {
    var promises = [model.loadCharMapping(), model.loadModel()];
    await Promise.all(promises);
    console.log("model done loading");
    this.ready = true;
    this.loaded = true;

    if (updateCustomPanel) {
      updateCustomPanel();
    }
  }

  async predictionRequest(file) {
    if (!this.ready) {
      return;
    }

    this.ready = false;

    var charArray = [];

    try {
      if (!model.isModelLoaded()) {
        console.log("Server Prediction");
        charArray = await RequestController.serverPrediction(file);
      } else {
        console.log("Local Prediction");
        const arr = await model.localPrediction(file);
        charArray = model.applyMapping(arr);
        console.log(model.applyMapping(arr));
      }

      this.charData = charArray;
      this.ready = true;

      if (updateCustomPanel) {
        updateCustomPanel();
      }
    } catch (e) {
      console.log("erorr" + e);
    }
  }

  async query(str) {
    var response = null;

    this.ready = false;

    try {
      response = await RequestController.serverQuery(str);

      if (response.length == 0) {
        response = "Sorry, no results found for " + str;
      }
    } catch (e) {
      response = e;
      console.log(e);
    }

    this.ready = true;
    this.queryResults = response;

    if (updateCustomPanel) {
      updateCustomPanel();
    }
  }

  getCharData() {
    return this.charData;
  }

  getQueryData() {
    return this.queryResults;
  }

  setCustomPanelCallback(fn) {
    updateCustomPanel = fn;
  }

  isLoaded() {
    return this.loaded;
  }
}

export default Controller;
