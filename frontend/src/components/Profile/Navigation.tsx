import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

export const Navigation = () => (
  <motion.ul variants={variants}>
    {itemIds.map(i => (
      <MenuItem 
        i={i} 
        msg={itemStr[i]}
        key={i} />
    ))}
  </motion.ul>
);

const itemStr = ['Profile', 'Settings', 'Log Out'];
const itemIds = [0,1,2];
