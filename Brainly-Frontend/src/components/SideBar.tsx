import { useNavigate } from "react-router-dom";
import { SideBarIcon } from "../icons/SideBarIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SideBarItem } from "./SideBarItem";

export function SideBar()
{
  const navigate=useNavigate()
  return (
    <div className="w-72 h-screen bg-white border-r flex flex-col">

      <div className="flex justify-center m-4 items-center pb-6 pt-3">
        <SideBarIcon></SideBarIcon>
        <div className="font-bold pr-10 text-2xl">Brainly</div>
      </div>

      <SideBarItem text="Youtube" icon={<YoutubeIcon></YoutubeIcon>}></SideBarItem>
      <SideBarItem text="Twitter" icon={<TwitterIcon></TwitterIcon>}></SideBarItem>
      <button onClick={()=>{
        localStorage.removeItem("token")
        navigate("/signin");
      }}
      className="flex bottom-0 m-1 gap-2 justify-center p-2 items-center hover:bg-gray-200 rounded-md text-md hover:text-red-500">LogOut</button>
    </div>
    
  )
}