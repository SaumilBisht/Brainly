import { Input } from "../components/Input"
import { Buttons } from "../components/Buttons"
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export function Signup()
{
  const usernameRef=useRef<HTMLInputElement>();
  const passwordRef=useRef<HTMLInputElement>();
  const navigate=useNavigate();

  async function signup()
  {
    const username=usernameRef.current?.value;
    const password=passwordRef.current?.value;
    await axios.post(`${BACKEND_URL}/api/v1/signup`,{
      username,
      password
    })

    
    navigate("/signin")

    alert('You have signed in')
  }
  
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="flex flex-col bg-white min-w-48 rounded-xl border p-8">
      <Input reference={usernameRef} placeholder="Username"></Input>
      <Input reference={passwordRef} placeholder="Password"></Input>
        <div className="flex justify-center">
          <Buttons onClick={signup} variant="primary" text="Sign Up" size="md" fullWidth={true} loading={false}></Buttons>
        </div>
      </div>

    </div>
  )
}