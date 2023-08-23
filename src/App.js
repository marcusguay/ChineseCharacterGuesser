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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

console.log(tf.version);
var model = null;
var charArray = null;
var pArray = [];
var ready = true;
var alreadyLoaded = false;






 class MyApp extends Component{

 constructor(props){
  super(props);
  this.state = {
     panelArray : [],
     modelOne : null
  }



 }

  childRef= React.createRef();


  componentDidMount() {
    //this.loadModel();
  }





async loadModel(){


  const response = await fetch('https://chinese-character-server.onrender.com/GetCharData');
  const json = await response.json();
  charArray = json['array'];


  if(!model && !alreadyLoaded) 
    model = await tf.loadLayersModel('https://tensorflowjsmodel.b-cdn.net/model.json');
    console.log(model);
    this.setState({ modelOne: model });
    alreadyLoaded = true;
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

      console.log("finished predictions");

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
      
        
      tf.engine().endScope();
      ready = true;
    } else {
      this.setState({ modelOne: null });
      console.error("model not loaded");
   }
 }



  render(){
     
    if(!model)
    return (
      <Box sx={{display:'center', backgroundColor : "#30475E", height : "100vh", justifyContent: 'center' }  }>
        <div style={{padding: 250}}> 
        <Typography variant="h4" paddingBottom={1} color={"White"}> Loading model </Typography>
        <div style={{paddingLeft: 85}}> <CircularProgress />  </div></div>
      </Box>
    );
       
    

   return ( 
   <div className= "MyApp" style={{ display: "flex", backgroundColor: "#30475E"}}> 
   <Container  > <Canvas props = {this.ServerRequest.bind(this)}  
    > </Canvas> </Container>
   <CustomPanel ref={this.childRef} props={pArray} />
   

   </div>);
  }



}


export default MyApp;
