import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { pinyinFormat } from "pinyin-format";

const pinyinParser = (string) => {
  var arr = string.split(" ");
  var newString = "";

  arr.forEach((str) => {
    newString = newString + pinyinFormat(str) + " ";
  });

  return newString;
};

const extractInfo = (info) => {
  console.log(info);
  if ("english" in info) {
    return (
      <CardContent style={{ display: "flex", flexGrow: "1", padding: "10px" }}>
        <div style={{ padding: "10px", display: "flex", flexGrow: "1" }}>
          <div>
            <Typography variant="h4"> {info.simplified} </Typography>
            <Typography variant="body" style={{ color: "gray", opacity: 0.75 }}>
              {" "}
              {pinyinParser(info.pinyin)}{" "}
            </Typography>
          </div>
          <div style={{ flexGrow: 0.5 }}></div>
          <div style={{ maxWidth: "300px" }}>
            <Typography> {info.english} </Typography>
            <Typography>
              {" "}
              <strong style={{ color: "gray", opacity: 0.5 }}>
                Traditional:
              </strong>{" "}
              {info.traditional}
            </Typography>
          </div>
        </div>
      </CardContent>
    );
  } else {
    return (
      <CardContent style={{ display: "flex", flexGrow: "1", padding: "10px" }}>
        <div style={{ padding: "10px", display: "flex", flexGrow: "1" }}>
          <div>
            <Typography variant="h4"> {info.character} </Typography>
            <Typography variant="body" style={{ color: "gray", opacity: 0.75 }}>
              {" "}
              {info.pinyin}{" "}
            </Typography>
          </div>
          <div style={{ flexGrow: 0.5 }}></div>
          <div>
            <Typography> {info.definition} </Typography>
            <Typography>
              {" "}
              <strong style={{ color: "gray", opacity: 0.5 }}>
                Radical:
              </strong>{" "}
              {info.radical}
            </Typography>
            <Typography>
              {" "}
              <strong style={{ color: "gray", opacity: 0.5 }}>
                Strokes:
              </strong>{" "}
              {info.stroke_count}
            </Typography>
          </div>
        </div>
      </CardContent>
    );
  }
};

const renderCharacterInfo = (props) => {
  var array = props;

  console.log(props);

  if (array == null || typeof array == "string") {
    return (
      <Typography variant="h5" paddingBottom={1} color={"White"}>
        {" "}
        {array}{" "}
      </Typography>
    );
  }
  var int = 0;
  array = array.map((element) => {
    int++;
    return (
      <div
        style={{
          paddingLeft: 25,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <li key={int} style={{ color: "white", width: "500px" }}>
          {" "}
          <Card style={{ padding: "20px", width: "30vw" }}>
            {" "}
            {extractInfo(element)}{" "}
          </Card>{" "}
        </li>
      </div>
    );
  });
  return array;
};

export default renderCharacterInfo;
