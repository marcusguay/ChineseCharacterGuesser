import React from "react";
import Model from "../model/Model";
import RequestController from "./RequestController";
import { Component } from "react";
var model = new Model();

var updateCustomPanel = null;

class Controller {
  constructor() {
    this.ready = false;
    this.charData = [];
    this.queryResults = [];
    this.createModel();
  }

  async createModel() {
    await model.loadModel();
    console.log("model done loading");
    this.ready = true;

    if (updateCustomPanel) {
      updateCustomPanel();
    }
  }

  async predictionRequest(file) {
    if (!this.ready || !model.isModelLoaded()) {
      return;
    }

    this.ready = false;
    var charArray = [];

    try {
      console.log("predicting");
      const arr = await model.localPrediction(file);
      charArray = model.applyMapping(arr);
      console.log(model.applyMapping(arr));

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

      this.queryResults = response;
    } catch (e) {
      response = e;
      console.log(e);
      this.queryResults = "Error: could not fetch";
    }

    this.ready = true;

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

  isReady() {
    return this.ready;
  }
}

export default Controller;
