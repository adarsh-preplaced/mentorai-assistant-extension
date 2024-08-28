import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import MessageContainer from "../../components/message-container/message-container";
import useMain from "./use-main";
import "./main.css";

const Main = () => {
  const { showPopup, handleTogglePopup } = useMain();

  return (
    <div style={{ zIndex: 10000 }}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/preplaced-upload-dev/o/mentorai-assistant-extension%2FStriver_Clickable_Avatar%20(3).svg?alt=media&token=40031c75-8356-4748-9479-9357b5642eef"
        alt=""
        // className="hover:scale-110 transition-all duration-500 ease-in-out fixed bottom-0 right-[48px] cursor-pointer z-[10000]"
        className="chatToggleBtn"
        onClick={handleTogglePopup}
        // height={50}
        // width={50}
      />
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // className="w-[500px] h-[70vh] fixed bottom-[150px] right-[100px] z-[10000]"
            className="popup"
          >
            <MessageContainer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
