```
docker build --tag test .
docker run -it --rm test:latest ash -c "node -v"
docker run -it --rm test:latest ash -c "ffmpeg -version"
```
