let video = document.querySelector("video");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let constraints = {
  video: true,
  audio: true,
};

let recorder;
let recordFlag = false;
let videoInChunk = [];

let x = navigator.mediaDevices.getUserMedia(constraints);

x.then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  //! When Recording Starts Clear the Chunk Array....
  recorder.addEventListener("start", () => {
    videoInChunk = [];
  });

  //! Save Data when Chunk or Data is Available...
  recorder.addEventListener("dataavailable", (event) => {
    videoInChunk.push(event.data);
  });

  //! When Recording is Paused Get The Data, And Download The Data....
  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(videoInChunk, { type: "video/mp4" });
    // --> Uploading the video data to a server using techniques like AJAX or Fetch API.
    // let videoURL = window.URL.createObjectURL(blob);
    // console.log(videoURL);
    // console.log(blob);

    // //! After That
    // let video = document.createElement("a");
    // video.href = videoURL;
    // video.download = `Live_Streaming_${new Date()}.mp4`;
    // video.click();

    /////////////////// START /////////////////////////

    /*

      1. Prepare a Transaction 
      2. Apply Transaction to Object Store.
      3. Add to VideoStore.

     */

    if (db) {
      let id = uuid.v4();
      console.log(uuid.v4());

      let transaction = db.transaction("video", "readwrite");
      let videoStore = transaction.objectStore("video");

      let entry = {
        id: id,
        videoData: blob,
      };

      videoStore.add(entry);
    }

    /////////////////// END /////////////////////////
  });
});

////////////////////////////////////////////////////////////////////
recordBtn.addEventListener("click", function () {
  if (recorder) {
    recordFlag = !recordFlag;
    if (recordFlag) {
      recorder.start();
      recordBtn.classList.add("record-anm");
      startTimer();
    } else {
      recorder.stop();
      recordBtn.classList.remove("record-anm");
      stopTimer();
    }
  }
});

//! Capture Photo
captureBtn.addEventListener("click", (e) => {
  console.log("hello");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //! Applying Filter
  ctx.fillStyle = transparentColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //! Applying Filter

  let screenShotURL = canvas.toDataURL();

  let screenShot = document.createElement("a");
  screenShot.href = screenShotURL;
  screenShot.download = "Capture.png";
  screenShot.click();
});

////////////////////////////////////////////////////////////////////
let timer = document.querySelector(".timer");
let counter = 0;
let clear;
function startTimer() {
  clear = setInterval(() => {
    let totalSeconds = counter;

    let hour = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;

    let minute = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;

    hour = hour < 10 ? `0${hour}` : `${hour}`;
    minute = minute < 10 ? `0${minute}` : `${minute}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    timer.innerText = `${hour}:${minute}:${seconds}`;

    counter++;
  }, 1000);
}

function stopTimer() {
  clearInterval(clear);
  timer.innerText = "00:00:00";
}

//! Getting Colors From Boxes and Change transparentColor varible with Given filter Color
let filters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    transparentColor =
      getComputedStyle(filter).getPropertyValue("background-color");
    console.log(transparentColor);
    filterLayer.style.backgroundColor = transparentColor;
  });
});
