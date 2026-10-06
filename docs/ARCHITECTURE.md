# VisionTrack Architecture

The AI model is isolated behind a FastAPI service so Node remains focused on authentication, persistence, rules and real-time product behavior. This reflects a common production pattern: Python for ML serving, Node for application orchestration.

For continuous video, add a worker/queue layer (Redis + BullMQ/Kafka) and run inference asynchronously.
