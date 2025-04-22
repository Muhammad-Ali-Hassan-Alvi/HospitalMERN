import React from "react";
import { Triangle } from "react-loader-spinner";

function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        left: "55%",
        top: "52%",
        zIndex: "9999",
        transform: "translate(-70%,-70%)",
      }}
    >
      <Triangle
        height="350"
        width="350"
        color="#7366ff"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
}

export default Loader;
