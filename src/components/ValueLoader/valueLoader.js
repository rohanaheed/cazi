import React from "react";
import Loader from "react-loader-spinner";

export default function ValueLoader(props) {
  return (
    <Loader
      type="TailSpin"
      color="white"
      height={30}
      width={35}
      timeout={200000}
    />
  );
}
