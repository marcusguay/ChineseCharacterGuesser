import React from "react";
import { saveAs } from 'file-saver'
import { useEffect, useRef} from "react"
import paper from 'paper';
import { Raster } from "paper/dist/paper-core";
import Button from '@mui/material/Button';

export default function Canvas({props}){
      
    const reference = useRef(null);
    const pathRef = useRef(null);
    var isDrawing = false;
    const prevRefArray = [];
    var img = null;
    
   
 
    useEffect(() => {
    const canvas = reference.current;
    //window.innerWidth
       canvas.width = 96*10;
       canvas.height = 96*10;
       canvas.style.width = `${canvas.width/2}px`;
       canvas.style.height = `${canvas.height/2}px`;
   
     

     const context = canvas.getContext("2d");
     context.scale(2,2);
     context.lineCap = "round";
     context.strokeStyle = "black"
     context.lineWidth = 10;
   
     pathRef.current = context;

     pathRef.current.fillStyle = "white";
     pathRef.current.fillRect(0, 0, pathRef.current.canvas.width, pathRef.current.canvas.height);

     prevRefArray.push(getPrevImageData())
     
   },[])

  
      function getPrevImageData(){ 
        const img = new Image();
        img.src = reference.current.toDataURL();

       return img;
      }



  function clear() {
    pathRef.current.fillStyle = "white";
    pathRef.current.fillRect(0, 0, pathRef.current.canvas.width, pathRef.current.canvas.height);
  pathRef.current.beginPath();
  prevRefArray.push(getPrevImageData());

  }


  function download() {
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 96
    canvas.height = 96
    
  const img = new Image()
  img.src = reference.current.toDataURL();

img.onload = () => {
  var ratio  =  canvas.width/img.width;
  ctx.drawImage(img, 0,0, img.width, img.height, 0,0, img.width*ratio, img.height*ratio);
  var pixelData = ctx.getImageData(0,0,canvas.width,canvas.height);
  editPixels(pixelData.data);
 props(pixelData);
 }
}
  


function editPixels(data) {

    for(var i = 0; i < data.length; i = i + 1){
   if(data[i] !== 255) {
    data[i] = 0;
   }
    }

}




   // bound to mouse click
    const drawStart = ({nativeEvent}) => { 
        const {offsetX, offsetY} = nativeEvent;
        pathRef.current.beginPath();
        pathRef.current.moveTo(offsetX,offsetY);
        prevRefArray.push(getPrevImageData());
        isDrawing = true;
    }


    // bound to mouse release
    const drawEnd = () => { 
        pathRef.current.closePath();
        isDrawing = false;
    }



    // bound to mouse move
    const draw = ({nativeEvent}) => {
    
     if(!isDrawing) {
      return 
      }

        const {offsetX, offsetY} = nativeEvent;
        pathRef.current.lineTo(offsetX, offsetY);
        pathRef.current.stroke();
     }


     const undo = () =>{
      const ref = prevRefArray.pop();
      
      if(ref != null) {
  const img = ref;
  pathRef.current.drawImage(img, 0 ,0,960/2,960/2);
      
    }
  }


 
 
 return ( <div style={{ display: "flex" }}> <canvas 
     onMouseDown = {drawStart}
     onMouseUp = {drawEnd}
     onMouseMove = {draw}
     onMouseLeave = {() => {isDrawing = false;}}
     ref = {reference}
     style = {Style}
/> 
 <div style={{display : "grid"}}>
<Button 
 onClick = {clear}
 variant="contained"
 style = {{height : '30px'}}
> Clear
     </Button>
<Button 
 style = {{height : '30px'}}
 variant="contained"
  onClick={undo}
 > Undo </Button>

<Button 
 style = {{height : '30px'}}
  onClick= {download}
  variant="contained"
 > Predict </Button>

     </div>
</div>
);
}



const Style = {
    border : "10px solid white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
     };