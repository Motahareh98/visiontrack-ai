from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
import io
app=FastAPI(title='VisionTrack Detection Service',version='1.0.0')
model=YOLO('yolov8n.pt')
@app.get('/health')
def health(): return {'status':'ok','model':'yolov8n.pt'}
@app.post('/detect')
async def detect(file:UploadFile=File(...)):
    raw=await file.read(); image=Image.open(io.BytesIO(raw)).convert('RGB'); result=model.predict(image,verbose=False)[0]
    detections=[]
    for b in result.boxes:
        cls=int(b.cls.item()); conf=float(b.conf.item()); xyxy=[round(float(x),1) for x in b.xyxy[0].tolist()]
        detections.append({'class_id':cls,'label':result.names[cls],'confidence':round(conf,4),'box':xyxy})
    counts={}
    for d in detections: counts[d['label']]=counts.get(d['label'],0)+1
    return {'width':image.width,'height':image.height,'detections':detections,'counts':counts,'total':len(detections)}
