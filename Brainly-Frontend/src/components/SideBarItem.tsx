import { ReactElement } from "react";
export function SideBarItem({text,icon}:{
  text:string;
  icon:ReactElement;
})
{
  return (
    <div className="flex m-1 gap-2 justify-start p-2 items-center hover:bg-gray-200 rounded-md">
      <div className="pl-2">{icon}</div>
      <div className="text-md">{text}</div>
    </div>
  )
}