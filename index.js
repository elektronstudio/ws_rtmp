const child_process = require("child_process");
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const url = "test.flv";

  //const url = "rtmp://o1.babahhcdn.com:1935/bb1150-lo/ws_rtmp";

  // flv transcoding to file or to rtmp ingest

  const ffmpeg = child_process.spawn("ffmpeg", [
    "-re",

    "-i",
    "-",

    "-vcodec",
    "copy",

    "-acodec",
    "aac",

    "-f",
    "flv",

    "-y",

    url,
  ]);

  // mp4 transcoding to a file

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

  // ffmpeg handlers

  ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpeg.stdin.on("error", (e) => {
    console.log(e);
  });

  ffmpeg.on("close", () => {
    ws.terminate();
  });

  // ws handlers

  ws.on("message", (msg) => {
    // console.log(msg);
    ffmpeg.stdin.write(msg);
  });

  ws.on("close", (e) => {
    ffmpeg.kill("SIGINT");
  });
});
