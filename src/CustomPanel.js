import React, { useEffect, useState, forwardRef,useImperativeHandle} from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Size, Style } from "paper/dist/paper-core";
import Canvas from "./Canvas";
import { Tabs } from "@mui/material";
import Link from '@mui/material/Link';



const styles = {
  container: {
    backgroundColor: "#30475E",
    width: "100%",
    height: "100%",
    textAlign:"center",
    padding: "50px",
  }
}




const CustomPanel = forwardRef(({props},ref)=>{

  const [textData,setTextData] = useState("0");
  const [value,setValue] = useState(0);
  var array = props;
   
   useImperativeHandle(ref, () => ({
     setData: (k) => {
       setTextData(props);
     }
  }));

 const ExtractInfo = (info) =>{

 console.log(info)


  if(info.length === 2){
    return (<CardContent> 
      <Typography variant="h4"> {info[1]}  </Typography>
      <Typography> {info[0]}  </Typography>
       </CardContent>);
       }


   return (<CardContent> 
  <Typography variant="h4"> {info[2]}  </Typography>
  <Typography> {"Pinyin : " + info[0]}  </Typography>
  <Typography>{info[1]} </Typography>
   </CardContent>);
   }
   
   
   const GetTextChildren =(props) =>{
      if(props.length == 0){
      return  <Typography variant="h5" color={"white"}> Predictions will show up here :</Typography>
      }

     var array = props;
     console.log(props);
     
     array = array.map((element) =>{

      return <li> <Card> {ExtractInfo(element)} </Card> </li>
     })
     
      return (<ul  style = {{listStyleType : 'none'}}> {array}</ul>);
   }
      
   function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
           {children}
          </Box>
        )}
      </div>
    );
  }

   const handleChange = (event, newValue) => {
    setValue(newValue);
  };
        
   console.log({props});
   console.log("child component rendered" + array[0]);
return (<Container style = {styles.container}>  
 <Box sx={{ borderBottom: 1, borderColor: 'white' }}>
 <Tabs  value = {value} aria-label="example" onChange={handleChange}>
<Tab label={<span style={{ color: 'white', fontSize: '20px'}}>Predict</span>}> </Tab>
<Tab label={<span style={{ color: 'white', fontSize: '20px'}}>About</span>}> </Tab>
 </Tabs>
 </Box>

<TabPanel value= {value} index = {0}>
{GetTextChildren(props)}
</TabPanel>
<TabPanel value= {value} index = {1}>
<Box style = {{backgroundColor : "#30475E", borderRadius: '15px', padding: "10px"}}> 

<Typography style={{padding : "20px"}} variant="body1" color={"white"}> Draw a Chinese character in the canvas and after pressing the "predict" button 
a neural network will try to predict it. Predictions will show up in the "Predictions" tab along with character meanings.
 </Typography>

 <Typography style={{padding : "20px"}} variant="body1" color={"white"}> Predictions are done client side in the browser using tensorflowjs
 </Typography>

<Typography style={{padding : "20px"}} variant="body1" color={"white"}> The neural network was trained on 7186 
characters from the CASIA-HWDB dataset which can be found at:
<Link> https://www.kaggle.com/datasets/pascalbliem/handwritten-chinese-character-hanzi-datasets?resource=download </Link> 
 </Typography>

 <Typography style={{padding : "20px"}} variant="body1" color={"white"}> The dataset that provides information about each character can be found at:
 <Link>  http://hanzidb.org/character-list/general-standard </Link> </Typography>

 </Box> 
</TabPanel>



 </Container>)

//return (<Container style = {styles.container}>  
//<Typography variant="h2" color={"white"}> Predictions: </Typography>
//{GetTextChildren(props)}
 //</Container>)
 

 
 });







export default CustomPanel;