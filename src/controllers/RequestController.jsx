import { string } from "@tensorflow/tfjs";
import React from "react";


const serverPath = "https://p01--chinesecharacterguesser--dcvsv2cpvvf9.code.run/";

const RequestController = {
  loadCharData: loadCharData,
  serverPrediction: serverPrediction,
  serverQuery: serverQuery,
};

async function loadCharData() {
  return fetch(serverPath.concat("GetCharData"));
}

async function serverPrediction(file) {
  return new Promise(async (resolve, reject) => {
    try {
      var data = file.data.buffer;
      var request = serverPath.concat("Predict");
      console.log(request);

      const response = await fetch(request, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (response.ok == false) {
        return reject("bad response");
      }
      const str = await response.json();
      return resolve(str);
    } catch (e) {
      return reject(e);
    }
  });
}

async function serverQuery(str) {
  console.log("querying db with " + str);
  return new Promise(async (resolve, reject) => {
    try {
      var request = serverPath.concat("Query");
      if (str.length > 20) {
        return reject("Cannot search for anything larger than 20 characters");
      }

      const json = { string: str };
      console.log(json);
      const response = await fetch(request, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });

      if (response.ok) {
        const str = await response.json();
        return resolve(str);
      } else {
        const res = await response.json();
        return reject(res.error);
      }
    } catch (e) {
      return reject(e);
    }
  });
}

export default RequestController;
