import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import {createServer} from 'http';
import {Server} from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();app.use(cors());app.use(express.json());
const http=createServer(app);const io=new Server(http,{cors:{origin:'*'}});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024}});
const AI_URL=(process.env.AI_URL||'http://localhost:8000').replace(/\/$/,'');
const __dirname=path.dirname(fileURLToPath(import.meta.url));

let dbReady=false;
if(process.env.MONGO_URI){
  try{await mongoose.connect(process.env.MONGO_URI);dbReady=true;console.log('MongoDB connected')}
  catch(e){console.warn('Mongo unavailable, using demo memory store:',e.message)}
}else console.log('MONGO_URI not set; using demo memory store');

const Event=mongoose.model('VisionEvent',new mongoose.Schema({fileName:String,width:Number,height:Number,total:Number,counts:Object,detections:Array,alert:Boolean,createdAt:{type:Date,default:Date.now}}));
const memory=[];

app.get('/api/health',(q,s)=>s.json({ok:true,service:'visiontrack-api',storage:dbReady?'mongodb':'memory'}));
app.post('/api/detect',upload.single('image'),async(req,res)=>{
  try{
    if(!req.file)return res.status(400).json({error:'image is required'});
    const fd=new FormData();fd.append('file',new Blob([req.file.buffer],{type:req.file.mimetype}),req.file.originalname);
    const r=await fetch(`${AI_URL}/detect`,{method:'POST',body:fd});
    const a=await r.json();if(!r.ok)throw new Error(a.detail||'AI detection failed');
    const alert=(a.counts?.person||0)>=2;
    let ev;
    const payload={fileName:req.file.originalname,width:a.width,height:a.height,total:a.total,counts:a.counts,detections:a.detections,alert,createdAt:new Date().toISOString()};
    if(dbReady) ev=await Event.create(payload);
    else {ev={...payload,_id:crypto.randomUUID()};memory.unshift(ev)}
    io.emit('vision:event',ev);res.json(ev)
  }catch(e){res.status(502).json({error:e.message})}
});
app.get('/api/events',async(q,s)=>s.json(dbReady?await Event.find().sort({createdAt:-1}).limit(30):memory.slice(0,30)));
app.get('/api/analytics',async(q,s)=>{
  const ev=dbReady?await Event.find().sort({createdAt:-1}).limit(200):memory.slice(0,200);
  const counts={};for(const e of ev)for(const[k,v]of Object.entries(e.counts||{}))counts[k]=(counts[k]||0)+v;
  s.json({events:ev.length,alerts:ev.filter(x=>x.alert).length,objectTotals:counts,storage:dbReady?'mongodb':'memory'})
});
io.on('connection',s=>console.log('dashboard connected',s.id));

const clientDist=path.resolve(__dirname,'../../client/dist');
app.use(express.static(clientDist));
app.use((req,res,next)=>{
  if(req.method==='GET'&&!req.path.startsWith('/api/')&&!req.path.startsWith('/socket.io/')) return res.sendFile(path.join(clientDist,'index.html'));
  next();
});

http.listen(process.env.PORT||5000,'0.0.0.0',()=>console.log('VisionTrack web app running'));
