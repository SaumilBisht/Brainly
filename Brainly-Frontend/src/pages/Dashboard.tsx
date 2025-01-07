import { Card } from '../components/Card'
import { Buttons } from '../components/Buttons'
import { Add } from '../icons/Add'
import { Share } from '../icons/Share'
import { CreateContentModal } from '../components/CreateContentModal'
import { useState,useEffect } from 'react'
import { SideBar } from '../components/SideBar'
import { BACKEND_URL } from "../config";
import axios from 'axios'
import { useContent } from "../hooks/useContext" // Custom hook to fetch content

export function Dashboard() {

  const [modal,setModal]=useState(false)

  const {contents, refresh} = useContent();

  // useEffect hook to refresh the content whenever the modalOpen state changes
  useEffect(() => {
    refresh();
    console.log(contents)
  }, [modal])

  return (
    <div className='flex'>

      <SideBar></SideBar>

      <div className='w-full p-2 min-h-screen bg-gray-100 border-2'>
        <div className="flex justify-end gap-4">
          <Buttons variant="primary" text="Add Content" size="lg" startIcon={<Add size="lg"/>} onClick={()=>{
            setModal(true)
          }}></Buttons>

          {/* SHARE LINK GENERATE */}
          <Buttons onClick={async () => {
              // Making a POST request to share the brain content
              const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                  share: true
              }, {
                  headers: {
                      "Authorization": localStorage.getItem("token") // Passing the authorization token in the request header
                  }
              });
              // Constructing the share URL and alerting the user with the link
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              alert(shareUrl);
          }} variant="secondary" text="Share" size="lg" startIcon={<Share size="lg"></Share>}></Buttons>

        </div>

        <div className="flex gap-4 flex-wrap">
          {/* Rendering the content cards dynamically from the 'contents' array */}
          {contents.map(({type, link, title}) => (
            <Card 
                type={type} 
                link={link} 
                title={title} 
            />
          ))}
        </div>

        <CreateContentModal open={modal} onClose={()=>{
          setModal(false)
        }}></CreateContentModal>
      </div>
    </div>
  )
}
