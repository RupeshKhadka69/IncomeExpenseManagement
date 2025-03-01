import React from "react";
import { motion } from "framer-motion";

const Loading = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "#7f69ef",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default Loading;
