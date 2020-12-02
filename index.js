const child_process = require("child_process");
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const url = "test.flv";
  // const key = "test123";
  // const url = "rtmp://o1.babahhcdn.com:1935/bb1150-lo/" + key;

  const ffmpeg = child_process.spawn("ffmpeg", [
    "-f",
    "lavfi",
    "-i",
    "anullsrc",

    "-i",
    "-",

    "-shortest",

    "-vcodec",
    "copy",

    "-acodec",
    "aac",

    "-f",
    "flv",

    "-y",

    url,
  ]);

  /*
  const url = "test.mp4";

  const ffmpeg = child_process.spawn("ffmpeg", [
    "-i",
    "-",

    "-movflags",
    "+empty_moov",

    "-movflags",
    "+faststart",

    "-vcodec",
    "copy",

    "-acodec",
    "copy",

    "-f",
    "mp4",

    "-map",
    "0",

    "-y",

    url,
  ]);
  */

  ffmpeg.on("close", (code, signal) => {
    console.log(
      "FFmpeg child process closed, code " + code + ", signal " + signal
    );
    ws.terminate();
  });

  ffmpeg.stdin.on("error", (e) => {
    console.log(e);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ws.on("message", (msg) => {
    console.log("DATA", msg);
    ffmpeg.stdin.write(msg);
  });

  ws.on("close", (e) => {
    ffmpeg.kill("SIGINT");
  });
});
