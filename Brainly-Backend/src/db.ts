import mongoose from "mongoose"
import {model,Schema} from "mongoose"

mongoose.connect("mongodb+srv://bishtsaumil:1gupbDqMS8dIYz63@cluster0.9p1qw.mongodb.net/Brainly")

const UserSchema=new Schema({
  username:{
    type:String,
    unique:true
  },
  password:String
});

export const UserModel=model('User',UserSchema)//pehla collection(table name)

const ContentSchema=new Schema({
  link: String,
  title: String,
  type:String,
  tags:[
    {
      type:mongoose.Types.ObjectId,
      ref:'Tag'
    }],
  userId:
  {
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:true
  }
  
})

export const ContentModel=model('Content',ContentSchema)

const LinkSchema=new Schema({
  hash:{type:String,required:true},
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  }
})

export const LinkModel=model('Link',LinkSchema)

const TagsSchema=new Schema({
  title:{
    type:String,
    required:true,
    unique:true
  }
})
export const TagModel=model('Tag',TagsSchema)
//usermodel is just jisse CRUD queries bas



