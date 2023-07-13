import Canvas from "./Canvas";
import './App.css'
import { Component, useRef } from "react";
import CustomPanel from "./CustomPanel"
import Panel from "./CustomPanel";
import React from 'react'
import ReactDOM from 'react-dom'
import { Color } from "paper/dist/paper-core";
import { Container } from "@mui/material";
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl';

console.log(tf.version);
var model = null;
var charArray = null;
var pArray = [];
var ready = true;






 class MyApp extends Component{

 constructor(props){
  super(props);
  this.state = {
     panelArray : [],
  }

this.loadModel();

 }

  childRef= React.createRef();


  componentDidMount() {
    
  }





async loadModel(){


  const response = await fetch('https://chinese-character-server.onrender.com/GetCharData');
  const json = await response.json();
  charArray = json['array'];


  if(!model) 
    model = await tf.loadLayersModel('https://chinese-character-server.onrender.com/model.json');
  }


 sendData(){
  this.setState({panelArray : Array},() => {
    console.log("in thing" + pArray);
    this.childRef.current.setData(pArray);
   })
 }

 


 async ServerRequest(file){
  
    if(model && ready){
      ready = false;
      // Make sure tensors are freed from memory
      tf.engine().startScope()
     const tensor = tf.browser.fromPixels (file, 1).expandDims();
     var predictions = await model.predict(tensor);
    
     predictions = predictions.reshape([7186]);
     var array = await predictions.data();
      var i = 0;
      var map = {}
      pArray = [];

      array.forEach(element => {
        map[element] = i;
        i++;
      });
    
      array = array.sort(((a,b)=>b-a));
      array = array.slice(0,5);
      array = array.map((i) => {
        return map[i];
      });

          var int = 0;
          var Request = 'https://chinese-character-server.onrender.com/CharSearch/?char='
      array.forEach( async element =>{
        const character = charArray[element];
        console.log(character);  
        Request = Request.concat(character)
      })


      console.log(Request)
      const response = await fetch(Request);
      const str = await response.json();
      console.log(str);
      pArray = str;
      this.sendData();
      
       ready = true;
      tf.engine().endScope();

    } else {
      console.error("model not loaded");
   }
 }



  render(){
   

   return ( 
   <div className= "MyApp" style={{ display: "flex", backgroundColor: "#30475E"}}> 
   <Container  > <Canvas props = {this.ServerRequest.bind(this)}  
    > </Canvas> </Container>
   <CustomPanel ref={this.childRef} props={pArray} />
   

   </div>);
  }



}


export default MyApp;