import React from "react";
import MentoraiIcon from "../../../../assets/mentorai-header.svg";
import GradientMeshIcon from "../../../../assets/gradient-mesh.svg";
import CloseIcon from "../../../../assets/close.svg";
import "./chat-header.css";

const ChatHeader = ({ handleTogglePopup }) => {
  return (
    <div className="chat-header-container">
      <div className="left">
        <img src={MentoraiIcon} alt="" className="mentorai-image" />
        <div className="info-container">
          <p className="title">
            Striver’s AI
            <img src={GradientMeshIcon} alt="" style={{ marginLeft: "4px" }} />
          </p>
          <span className="status">Online</span>
        </div>
      </div>
      <img
        src={CloseIcon}
        alt=""
        className="close"
        onClick={handleTogglePopup}
      />
    </div>
  );
};

export default ChatHeader;
