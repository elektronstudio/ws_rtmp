### About

Webcam WebM stream over Websocket to RTMP stream

### Usage

Run locally:

```
npm install
node .
```

Run using Docker:

```
docker build --tag test .
docker run -p 8080:8080 test
```

Test the Node and ffmpeg versions:

```
docker run -it --rm test:latest ash -c "node -v"
docker run -it --rm test:latest ash -c "ffmpeg -version"
```

https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

https://mux.com/blog/the-state-of-going-live-from-a-browser/

https://fly.io/blog/mux-fly-wocket-and-rtmp/

https://github.com/fbsamples/Canvas-Streaming-Example

https://api.video/blog/video-trends/live-streaming-a-video-using-just-the-browser
