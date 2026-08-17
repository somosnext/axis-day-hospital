import {clsx,type ClassValue} from "clsx"; import {twMerge} from "tailwind-merge";
export function cn(...inputs:ClassValue[]){return twMerge(clsx(inputs))} export function cleanText(v:string){return v.replace(/[<>]/g,"").trim()} export function formatDate(v:string){return new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v))}
