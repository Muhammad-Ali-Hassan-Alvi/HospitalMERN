import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";

const remove = () => {
  sessionStorage.removeItem("path");
};

export default function Tooltiphome() {
  return (
    <Tooltip title="Home">
      <Link to="/dashboard">
        <svg className="stroke-icon" onClick={remove}>
          <use
            href={
              process.env.PUBLIC_URL + "/assets/svg/icon-sprite.svg#stroke-home"
            }
          ></use>
        </svg>
      </Link>
    </Tooltip>
  );
}
