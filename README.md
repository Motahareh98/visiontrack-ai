# VisionTrack AI — Real-Time Computer Vision Monitoring

A full-stack **AI + MERN** computer-vision application that runs YOLO inference, stores detection events in MongoDB and pushes live updates to connected dashboards with Socket.IO.

## Highlights
- Real YOLO object detection through Ultralytics.
- Bounding boxes, class labels and confidence scores rendered in React.
- Express API for image uploads and event analytics.
- MongoDB event persistence.
- Socket.IO real-time event stream.
- Rule-based alerting example for multi-person detection.
- Docker Compose + GitHub Actions CI.

## Architecture
```text
React Dashboard ← Socket.IO ← Express API → MongoDB
                              ↓
                         FastAPI AI Service
                              ↓
                           YOLOv8
```

## Run
```bash
docker compose up --build
```
Open `http://localhost:4175`.

## API highlights
- `POST /api/detect` — upload image and run detection
- `GET /api/events` — latest detection events
- `GET /api/analytics` — aggregate object counts and alerts
- AI `POST /detect` — YOLO inference endpoint

## Production extensions
RTSP/video streams, ByteTrack/DeepSORT tracking, zones, custom-trained models, queues, GPU workers, notification routing and observability.
