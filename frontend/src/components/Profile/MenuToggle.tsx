import * as React from "react";
import { motion } from "framer-motion";

const PathProfile = (props:any) => (
  <motion.path
  transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
    fill="#6A7985"
    stroke="none"
    {...props}
  />
);

const PathClose = (props:any) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        stroke="#6A7985"
        {...props}
    />
  );

export const MenuToggle = ({ toggle }:any) => (
  <button className="button" onClick={toggle}>
    <motion.svg width="64" height="64" viewBox="0 0 64 64">
      <PathProfile
        variants={{
          closed: { opacity: 1, d: "M192 619 c-204 -79 -260 -370 -102 -529 124 -123 336 -123 460 0 159 160 102 452 -105 529 -74 28 -180 28 -253 0z m234 -44 c40 -16 107 -77 134 -119 51 -83 46 -207 -11 -286 l-31 -42 -17 28 c-10 16 -33 43 -52 59 l-35 30 23 34 c27 40 31 107 8 152 -48 92 -202 92 -250 0 -23 -45 -19 -112 8 -152 l23 -34 -35 -30 c-19 -16 -42 -43 -52 -59 l-17 -28 -31 42 c-40 55 -56 134 -41 203 20 99 110 193 205 216 47 12 125 5 171 -14z m-65 -131 c17 -8 37 -30 45 -50 20 -48 -1 -99 -51 -119 -107 -45 -180 105 -81 166 38 23 48 23 87 3z m11 -240 c34 -7 100 -79 96 -102 -5 -29 -76 -56 -148 -56 -72 0 -143 27 -148 56 -5 26 64 95 106 106 20 5 44 8 52 6 8 -2 27 -6 42 -10z" },
          open: { opacity: 0, d: "M192 619 c-204 -79 -260 -370 -102 -529 124 -123 336 -123 460 0 159 160 102 452 -105 529 -74 28 -180 28 -253 0z m234 -44 c40 -16 107 -77 134 -119 51 -83 46 -207 -11 -286 l-31 -42 -17 28 c-10 16 -33 43 -52 59 l-35 30 23 34 c27 40 31 107 8 152 -48 92 -202 92 -250 0 -23 -45 -19 -112 8 -152 l23 -34 -35 -30 c-19 -16 -42 -43 -52 -59 l-17 -28 -31 42 c-40 55 -56 134 -41 203 20 99 110 193 205 216 47 12 125 5 171 -14z m-65 -131 c17 -8 37 -30 45 -50 20 -48 -1 -99 -51 -119 -107 -45 -180 105 -81 166 38 23 48 23 87 3z m11 -240 c34 -7 100 -79 96 -102 -5 -29 -76 -56 -148 -56 -72 0 -143 27 -148 56 -5 26 64 95 106 106 20 5 44 8 52 6 8 -2 27 -6 42 -10z" }
        }}
        transition={{ duration: 0.1 }}
      />
      <PathClose
        variants={{
          closed: { opacity: 0, d: "M 10 2.5 L 20 2.5" },
          open: { opacity: 1, d: "M 10 16.5 L 51 48"}
        }}
        transition={{ duration: 0.1 }}
      />
      <PathClose
        variants={{
          closed: { opacity: 0, d: "M 10 16.346 L 20 16.346" },
          open: { opacity: 1, d: "M 10 48 L 51 16.5" }
        }}
      />
    </motion.svg>
  </button>
);
