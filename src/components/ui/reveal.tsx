"use client";

import{motion,useReducedMotion}from"framer-motion";import type{ReactNode}from"react";
export function Reveal({children,className}:{children:ReactNode;className?:string}){const reduced=useReducedMotion();return <motion.div className={className} initial={reduced?false:{opacity:0,y:22}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.55,ease:[.22,1,.36,1]}}>{children}</motion.div>}
