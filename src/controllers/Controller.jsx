import React from "react";
import Model from "../model/Model";
import RequestController from "./RequestController";
import { Component } from "react";
var model = new Model();

var updateCustomPanel = null;
var updatePanel = null;

class Controller extends Component {
  constructor() {
    super();
    this.state = {
      ready: true,
      charData: [],
      updatePanel: null,
      queryResults: [],
    };
  }

  async predictionRequest(file) {
    if (!this.state.ready) {
      return;
    }

    this.state = {
      ready: true,
      charData: this.state.charData,
      updatePanel: this.state.updatePanel,
      queryResults: this.state.queryResults,
    };

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

      this.state = {
        ready: true,
        charData: charArray,
        updatePanel: this.state.updatePanel,
        queryResults: this.state.queryResults,
      };

      if (updateCustomPanel) {
        updateCustomPanel();
      }
    } catch (e) {
      console.log("erorr" + e);
    }
  }

  async query(str) {
    var response = null;

    this.state = {
      ready: false,
      charData: this.state.charData,
      updatePanel: this.state.updatePanel,
      queryResults: response,
    };

    try {
      response = await RequestController.serverQuery(str);

      if (response.length == 0) {
        response = "Sorry, no results found for " + str;
      }
    } catch (e) {
      response = e;
      console.log(e);
    }

    this.state = {
      ready: true,
      charData: this.state.charData,
      updatePanel: this.state.updatePanel,
      queryResults: response,
    };

    if (updateCustomPanel) {
      updateCustomPanel();
    }
  }

  getCharData() {
    return this.state.charData;
  }

  getQueryData() {
    return this.state.queryResults;
  }

  setPanelCallback(fn) {
    updatePanel = fn;
  }

  setCustomPanelCallback(fn) {
    updateCustomPanel = fn;
  }
}

export default Controller;
