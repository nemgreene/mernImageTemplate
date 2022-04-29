import "./App.css";
// Bring this component back to trigger double render issue
import ImageTest from "./ImageTest";
import axios from "axios";
import { Buffer } from "buffer";
import React, { useState, useEffect } from "react";

const url = "http://localhost:3001/";

function App() {
  const [img, cImg] = useState();

  useEffect(() => {
    // axios call to server, pushes hardcoded image into db, and sends back b64 image data
    const fetch = async () => {
      let test = await axios({
        method: "POST",
        url: `${url}imagePush`,
      });

      // Hot Tamale 2.0 vvv
      cImg(new Buffer.from(test.data.image.data).toString("base64"));
    };

    fetch();
  }, []);

  // Image container component
  const DecodedImage = ({ data }) => (
    <img src={`data:image/jpeg;base64,${data}`} />
  );

  return (
    <div className="App">
      <div className="ImgTestContainer">
        <DecodedImage data={img} />
        {/* <ImageTest/> */}
      </div>
    </div>
  );
}

export default App;
