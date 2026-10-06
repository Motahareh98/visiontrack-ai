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


## Run locally without Docker (Windows)

You only need **Python 3.11+** and **Node.js 20+**. MongoDB is optional: if `MONGO_URI` is not configured, the app automatically switches to an in-memory demo store.

The easiest option is:

```bat
start-local.bat
```

The script will:
1. create a Python virtual environment for the AI service,
2. install Python dependencies,
3. start FastAPI on port 8000,
4. install/build the React client,
5. install/start the Node/Express app,
6. open http://localhost:5000.

> First launch can take longer because the AI model is downloaded once.

## Deploy online

A `render.yaml` Blueprint is included for Render. It defines:
- one Python AI web service,
- one Node/Express public web service that also serves the built React frontend,
- private service-to-service AI networking,
- no mandatory database dependency.

MongoDB remains optional. Set `MONGO_URI` later if persistent storage is required.

### Render account note
Render may require billing information before creating new web services, even when the service configuration uses the free plan. Once the account is allowed to create web services, the repository is deployment-ready.
