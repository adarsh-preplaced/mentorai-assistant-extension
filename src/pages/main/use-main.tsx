import React, { useEffect, useRef, useState } from "react";

const useMain = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleTogglePopup = () => {
    setShowPopup(!showPopup);
  };

  return { showPopup, handleTogglePopup };
};

export default useMain;
