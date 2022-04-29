import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
const url = "http://localhost:3001/";

export default function ImageTest() {
  const [img, cImg] = useState([]);

  const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />;

  useEffect(() => {
    const fetch = async () => {
      let test = await axios({
        method: "POST",
        url: `${url}imagePush`,
      });
      let testImg = new Buffer.from(test.data.image.data).toString("base64");
      cImg((p) => [...p, testImg]);
    };

    fetch();
  }, []);

  return (
    <div className="ImgTestContainer">
      {img.map((img, index) => {
        return <Example key={index} data={img} />;
      })}
    </div>
  );
}
