import { useRef, useState } from "react";
import { Cross } from "../icons/Cross";
import { Buttons } from "./Buttons";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

// Enum to represent different types of content
enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter"
}
interface CreateContentModalProps {
  open: boolean; // State to determine if the modal is open
  onClose: () => void; // Function to close the modal
}

export function CreateContentModal({open,onClose}:CreateContentModalProps)
{
  const titleRef=useRef<HTMLInputElement>();
  const linkRef=useRef<HTMLInputElement>();

  const [type, setType] = useState(ContentType.Youtube);
  
  async function addContent()
  {
    const title=titleRef.current?.value
    const link=linkRef.current?.value

    // Making a POST request to add new content
    await axios.post(`${BACKEND_URL}/api/v1/content`, {
      link,
      title,
      type
    }, {
      headers: {
          "Authorization": localStorage.getItem("token") || "" // Including the authorization token
      }
    });

    // Closing the modal after adding content
    onClose();
  }

  return (
    <div>
      {open && <div className="w-screen h-full bg-slate-600 fixed top-0 left-0 flex justify-center items-center bg-opacity-60">
          <div className="flex flex-col justify-center">
            <span className="bg-white p-4 rounded">
              <div className="flex justify-end cursor-pointer" onClick={onClose}>
                <Cross></Cross>
              </div>
              <div>
                <Input reference={titleRef} placeholder="Title"></Input>
                <Input reference={linkRef} placeholder="Link"></Input>
              </div>
              {/* Content type selection */}
              <div>
                  <h1 className="p-2">Select Type</h1>
                  <div className="flex gap-1 justify-center pb-2">
                      {/* Button to select YouTube type */}
                      <Buttons 
                          text="Youtube" size="md"
                          variant={ "secondary"}
                          onClick={() => setType(ContentType.Youtube)}
                      />
                      {/* Button to select Twitter type */}
                      <Buttons
                          text="Twitter" size="md"
                          variant={ "secondary"}
                          onClick={() => setType(ContentType.Twitter)}
                      />
                  </div>
              </div>
              <div className="flex justify-center mt-2">
                <Buttons variant="primary" text="Submit" size="md" onClick={addContent}></Buttons>
              </div>
            </span>
          </div>
        </div>}
    </div>
  )
}
