import React from "react";
import Log from "../components/Log/index";

const Profil = () => {
  return (
    <div className="profil-page">
      <div className="log-container">
        <Log signin={false} signup={true} />
        <img src="./img/log.svg" alt="img-log" />
      </div>
    </div>
  );
};

export default Profil;
