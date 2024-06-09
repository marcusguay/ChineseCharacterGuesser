import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InputBase from "@mui/material/InputBase";
import { Tabs } from "@mui/material";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Controller from "../controllers/Controller";
import { pinyinFormat } from "pinyin-format";

import renderCharacterInfo from "./CardList";

const styles = {
  container: {
    backgroundColor: "#30475E",
    width: "100%",
    height: "100%",
    textAlign: "center",
    padding: "50px",
  },
};

const sampleArray = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

const CustomPanel = function ({ props }) {
  var [charData, setCharData] = useState([]);
  var [queryData, setQueryData] = useState([]);
  var [textData, setTextData] = useState("");
  const [value, setValue] = useState(0);
  var [ready, setReady] = useState(false);
  const [cursorStart, setCursorStart] = useState(0);
  const controller = props.controller;

  controller.setCustomPanelCallback(() => {
    setCharData(controller.getCharData());
    setQueryData(controller.getQueryData());
    setReady(controller.isLoaded());
  });

  const renderInfoTab = (props) => {
    return (
      <Box
        style={{
          backgroundColor: "#30475E",
          borderRadius: "15px",
          padding: "10px",
        }}
      >
        <Typography
          style={{ padding: "20px", fontSize: "20px" }}
          variant="body1"
          color={"white"}
        >
          {" "}
          If predictions are slow consider turning on browser acceleration.
        </Typography>

        <Typography
          style={{ padding: "20px", fontSize: "20px" }}
          variant="body1"
          color={"white"}
        >
          {" "}
          The neural network was trained on 7186 characters from the CASIA-HWDB
          dataset which can be found at:
          <Link
            href=" https://www.kaggle.com/datasets/pascalbliem/handwritten-chinese-character-hanzi-datasets"
            target="_blank"
          >
            {" "}
            https://www.kaggle.com/datasets/pascalbliem/handwritten-chinese-character-hanzi-datasets?resource=download{" "}
          </Link>
        </Typography>

        <Typography
          style={{ padding: "20px", fontSize: "20px" }}
          variant="body1"
          color={"white"}
        >
          {" "}
          The dataset that provides information about each character can be
          found at:
          <Link
            href="http://hanzidb.org/character-list/general-standard"
            target="_blank"
          >
            {" "}
            http://hanzidb.org/character-list/general-standard{" "}
          </Link>{" "}
          and the dataset for the vocabulary can be found at:
          <Link
            href="https://www.mdbg.net/chinese/dictionary?page=cc-cedict"
            target="_blank"
          >
            {" "}
            https://www.mdbg.net/chinese/dictionary?page=cc-cedict{" "}
          </Link>{" "}
        </Typography>
      </Box>
    );
  };

  const renderCharCards = (props) => {
    var array = props;
    array = array.map((element) => {
      return (
        <li style={{ margin: 0, padding: 5 }}>
          <Button
            onClick={() => {
              setTextData(textData + element);
            }}
            variant="contained"
            style={{ margin: 0, height: "35px", width: "35px" }}
          >
            {element}
          </Button>
        </li>
      );
    });

    return array;
  };

  const renderPredictionResult = (props) => {
    return (
      <div style={{ margin: 0, padding: 20, maxHeight: "70%" }}>
        {renderSearchTab({ value: textData })}
        <div style={{ height: 5 }}></div>
        {charData.length == 0 ? (
          <ul
            style={{
              margin: 0,
              listStyleType: "none",
              display: "flex",
              justifyContent: "flex-start",
              padding: 0,
            }}
          >
            {renderCharCards(sampleArray)}
          </ul>
        ) : (
          <ul
            style={{
              margin: 0,
              listStyleType: "none",
              display: "flex",
              justifyContent: "flex-start",
              padding: 0,
              width: "30vw",
            }}
          >
            {renderCharCards(charData)}
          </ul>
        )}
        <ul
          style={{
            listStyleType: "none",
            maxHeight: "70vh",
            overflowY: "auto",
            marginLeft: "auto",
            padding: 0,
          }}
        >
          {renderCharacterInfo(queryData)}
        </ul>
      </div>
    );
  };

  const renderSearchTab = (props) => {
    return (
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",

          width: "35vw",
        }}
      >
        <InputBase
          autoFocus={true}
          style={{
            backgroundcolor: "white",
            color: "white",
            fontSize: "20px",
            border: "5px solid white",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
          sx={{
            width: "60vh",
            input: {
              color: "black",
              background: "white",
            },
          }}
          placeholder={"Search for a character/word or its meaning"}
          onChange={(event) => {
            setCursorStart(event.target.selectionStart);
            setTextData(event.target.value);
          }}
          onFocus={(event) => {
            event.target.selectionStart = cursorStart;
            event.target.selectionEnd = cursorStart;
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              event.preventDefault();
              controller.query(textData);
            }
          }}
          value={props.value}
        ></InputBase>
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={() => {
            controller.query(textData);
          }}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={() => {
            setTextData("");
          }}
        >
          <ClearIcon />
        </IconButton>
      </Paper>
    );
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="TabPanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  if (!ready)
    return (
      <Box
        sx={{
          display: "center",
          opacity: 1,
          backgroundColor: "#30475E",
          width: "50vw",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "center",
            paddingLeft: "10vw",
            paddingTop: 250,
            width: "50vw",
          }}
        >
          <Typography variant="h4" paddingBottom={1} color={"White"}>
            {" "}
            Loading model{" "}
          </Typography>
          <div style={{ paddingLeft: 85 }}>
            {" "}
            <CircularProgress />{" "}
          </div>
        </div>
      </Box>
    );

  return (
    <Container style={styles.container}>
      <Box sx={{ borderBottom: 1, borderColor: "white" }}>
        <Tabs value={value} aria-label="example">
          <Tab
            label={
              <span style={{ color: "white", fontSize: "20px" }}>Predict</span>
            }
            key={0}
            onClick={() => {
              setValue(0);
            }}
          ></Tab>
          <Tab
            label={
              <span style={{ color: "white", fontSize: "20px" }}>About</span>
            }
            key={1}
            onClick={() => {
              setValue(1);
            }}
          ></Tab>
        </Tabs>
      </Box>

      <TabPanel style={{ flex: 1 }} value={value} index={0}>
        {renderPredictionResult(props)}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {renderInfoTab()}
      </TabPanel>
    </Container>
  );
};

export default CustomPanel;
