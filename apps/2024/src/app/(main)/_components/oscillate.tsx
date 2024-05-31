"use client";

import { motion } from "framer-motion";

interface Props {
  children: JSX.Element;
  delay?: number;
}

export const Oscillate = ({ children, delay = 0 }: Props) => {
  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 15, 0] }}
        transition={{
          delay: delay,
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
