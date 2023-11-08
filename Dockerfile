FROM node:18.11.0

RUN apt-get update && apt-get install -y ffmpeg
