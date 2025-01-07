import { Input } from "../components/Input"
import { Buttons } from "../components/Buttons"
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function Signin()
{
  const usernameRef=useRef<HTMLInputElement>();
  const passwordRef=useRef<HTMLInputElement>();
  const navigate=useNavigate();
  
  async function signin()
  {
    const username=usernameRef.current?.value;
    const password=passwordRef.current?.value;
    const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
      username,
      password
    })
    
    const jwt=response.data.token;
    localStorage.setItem("token",jwt);
    //redirect to dashboard now

    
    navigate("/dashboard")
    
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="flex flex-col bg-white min-w-48 rounded-xl border p-8">
        <Input reference={usernameRef} placeholder="Username"></Input>
        <Input reference={passwordRef} placeholder="Password"></Input>
        <div className="flex justify-center">
          <Buttons variant="primary" text="Sign In" size="md" fullWidth={true} loading={false} onClick={signin}></Buttons>
        </div>
      </div>
    </div>
  )
}