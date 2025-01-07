import express from "express"
import z from "zod"
import { ContentModel, UserModel,LinkModel } from "./db"
import jwt from "jsonwebtoken"
import { userMiddleware } from "./middleware"
import cors from "cors";
import {random} from "./utils"

const app=express()

import {JWT_PASSWORD} from "./config"

app.use(express.json())
app.use(cors())

//signup:username,pass
const userzod=z.object({
  username:z.string().min(3),
  password:z.string()
})
app.post("/api/v1/signup",async(req,res)=>{
  const {username}=req.body//destructing se body se liya
  const {password}=req.body

  try
  {
    const {success}=userzod.safeParse({username,password})
  
    //hash kro
    if(!success)
    {
      res.status(411).json({
        message:"Inputs Invalid"
      })
    }

    //were not checking if user exists here as humne unique username key di h in db
    await UserModel.create({
      username,password
    })
  
    res.json({
      message:"User signed up"
    })
  }
  catch(e)
  {
    res.status(411).json({
      message:"User Exists"
    })
  }
})

//signin: token return 
app.post("/api/v1/signin",async(req,res)=>{
  const {username}=req.body//destructing se body se liya
  const {password}=req.body

  try{
    const {success}=userzod.safeParse({username,password})
  
    //hash kro
    if(!success)
    {
      res.status(411).json({
        message:"Inputs Invalid"
      })
    }

    //were not checking if user exists here as humne unique username key di h in db
    const user=await UserModel.findOne({
      username,password
    })

    if(user)
    {
      const token=jwt.sign({id:user._id},JWT_PASSWORD)
  
      res.json({
        token
      })
    }
    else{
      res.status(403).json({
        message:"User does not exist"
      })
    }
  }
  catch(e)
  {
    res.status(411).json({
      message:"Signin Failed"
    })
  }
})

//add content
app.post("/api/v1/content",userMiddleware,async(req,res)=>
{
  const {link}=req.body
  const {title}=req.body
  const {type}=req.body

  await ContentModel.create({
    link,
    title,
    type,
    //@ts-ignore
    userId: req.userId, // userId is added by the middleware.
    tags: [] // Initialize tags as an empty array.
  });
  
  res.json({
    message:"Content Added"
  })
})

//fetching existing docs of user
app.get("/api/v1/content",userMiddleware,async(req,res)=>{
  //@ts-ignore

  const userId=req.userId
  const content=await ContentModel.find({
    userId: userId
  }).populate("userId","username") //foriegn key or ref was userId

  res.json({content})
})

//deleting apna contents
app.delete("app/v1/content",userMiddleware,async(req,res)=>{
  const contentId=req.body.contentId;
//@ts-ignore
  await ContentModel.deleteOne({ _id: contentId, userId: req.userId });
  res.json({
    message:"Contents deleted successfully"
  })
})


//Share Content Link
//middleware use as userId chahiye
//This endpoint allows users to generate or remove a shareable link for their content.
app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>
{
  const { share } = req.body;//boolean h share user ne diya h boy mei
  if (share){
      //@ts-ignore
      // Check if a link already exists for the user.
      const existingLink = await LinkModel.findOne({ userId: req.userId });
      if (existingLink) {
          res.json({ hash: existingLink.hash }); // Send existing hash if found.
          return;
      }

      // Generate a new hash for the shareable link.
      const hash = random(10);
      //@ts-ignore
      await LinkModel.create({ userId: req.userId, hash });
      res.json({ hash }); // Send new hash in the response.
  } else {
      // Remove the shareable link if share is false.
      //@ts-ignore
      await LinkModel.deleteOne({ userId: req.userId });
      res.json({ message: "Removed link" }); 
  }
})


//Get Shared Content from the link
app.get("/api/v1/brain/:shareLink",async(req,res)=>{
  const hash = req.params.shareLink;

  // Find the link using the provided hash.
  const link = await LinkModel.findOne({ hash });
  if (!link) {
      res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
      return;
  }

  // Fetch content and user details for the shareable link.
  const content = await ContentModel.find({ userId: link.userId });//for content
  const user = await UserModel.findOne({ _id: link.userId });//for username

  if (!user) {
      res.status(404).json({ message: "User not found" }); // Handle missing user case.
      return;
  }

  res.json({
      username: user?.username,//? for typescript cuz usse nhi pta
      content
  });
})

app.listen(3000);