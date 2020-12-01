const child_process = require("child_process");
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  //const rtmpUrl = "file.flv";
  const rtmpUrl = "test.mp4";
  //const rtmpUrl = "rtmp://o1.babahhcdn.com:1935/bb1150-lo/test123";
  console.log("Target RTMP URL:", rtmpUrl);

  // const ffmpeg = child_process.spawn("ffmpeg", [
  //   "-f",
  //   "lavfi",
  //   "-i",
  //   "anullsrc",

  //   "-i",
  //   "-",

  //   "-shortest",

  //   "-vcodec",
  //   "copy",

  //   "-acodec",
  //   "aac",

  //   "-f",
  //   "flv",

  //   rtmpUrl,
  // ]);

  const ffmpeg = child_process.spawn("ffmpeg", [
    "-i",
    "-",

    "-movflags",
    "+empty_moov",

    "-movflags",
    "+separate_moof",

    "-movflags",
    "+faststart",

    "-vcodec",
    "copy",

    "-acodec",
    "copy",

    "-f",
    "mp4",

    //force to overwrite
    "-y",

    // used for audio sync
    "-use_wallclock_as_timestamps",
    "1",
    "-async",
    "1",

    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
    //'-strict', 'experimental',
    "-bufsize",
    "1000",

    "-map",
    "0",

    rtmpUrl,
  ]);

  ffmpeg.on("close", (code, signal) => {
    console.log(
      "FFmpeg child process closed, code " + code + ", signal " + signal
    );
    ws.terminate();
  });

  ffmpeg.stdin.on("error", (e) => {
    console.log("FFmpeg STDIN Error", e);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.log("FFmpeg STDERR:", data.toString());
  });

  ws.on("message", (msg) => {
    console.log("DATA", msg);
    ffmpeg.stdin.write(msg);
  });

  ws.on("close", (e) => {
    ffmpeg.kill("SIGINT");
  });
});
