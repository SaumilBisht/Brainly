import { ReactElement } from "react";

export interface ButtonProps{
  variant:"primary" | "secondary";
  size:"sm" | "md" |"lg";
  text:String;
  startIcon ?:ReactElement;//can be ReactElement agr koi svg ka component bnaya ho
  endIcon ?: ReactElement;
  onClick?:()=>void;
  fullWidth?: boolean;
  loading?:boolean;
}
const variantStyles={
  "primary":"bg-purple-600 text-white",
  "secondary":"bg-purple-300 text-purple-500"
}
const defaultStyles:String="rounded-md flex justify-center content-center m-1"

const sizes={
  "sm":"p-1",
  "md":"p-2",
  "lg":"p-3"
}

export const Buttons=(props:ButtonProps)=>{
  return (
    //js mein object ko . se access ya [" "]
    <button className={`${variantStyles[props.variant]} ${defaultStyles} ${sizes[props.size]} ${props.fullWidth ?" flex justify-center w-full":""} ${props.loading?" opacity-45":""}`} disabled={props.loading} onClick={props.onClick}>
      {props.startIcon?<div className="pr-2">{props.startIcon}</div>:null}  
      <div>{props.text}</div>
      {(props.endIcon)?<div className="pl-2">{props.endIcon}</div>:null}  
    </button>
  )
}