import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import "./../../styles/Profile.css";

const sidebar = {
  open: (height = 70) => ({
    clipPath: `circle(${height * 2 + 200}px at 52px 5px)`,
    transition: {
      type: "spring",
      stiffness: 50,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(32px at 53px 51px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

function Profile() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav className="zone"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      <motion.div className="background" variants={sidebar} />
      <MenuToggle toggle={() => toggleOpen()} />
      {isOpen ? <Navigation /> : <div />}
    </motion.nav>
  );
};

export default Profile