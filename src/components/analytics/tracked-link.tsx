"use client";

import type{ReactNode}from"react";import{track}from"@/components/analytics/analytics";import{cn}from"@/lib/utils";
export function TrackedLink({href,event,className,children,label}:{href:string;event:string;className?:string;children:ReactNode;label?:string}){return <a href={href} onClick={()=>track(event,{label:label||String(children)})} className={cn(className)} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noopener noreferrer":undefined}>{children}</a>}
