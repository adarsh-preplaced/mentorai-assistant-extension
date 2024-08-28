import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import MessageContainer from "../../components/message-container/message-container";
import useMain from "./use-main";

const Main = () => {
  const { showPopup, handleTogglePopup } = useMain();

  return (
    <>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/preplaced-upload-dev/o/raj_mentorai.svg?alt=media&token=ba4ad093-a354-4c6c-9649-8488ed6d0061"
        alt=""
        className="hover:scale-110 transition-all duration-500 ease-in-out absolute bottom-[80px] right-[60px] cursor-pointer"
        onClick={handleTogglePopup}
        height={50}
        width={50}
      />
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[500px] h-[80vh] absolute bottom-[120px] right-[100px]"
          >
            <MessageContainer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Main;
