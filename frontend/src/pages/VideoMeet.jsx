import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import server from "../environment";
import { useNavigate } from "react-router-dom";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoref = useRef();
  const navigate = useNavigate();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(false); // Defaulted to false for cleaner start
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("HELLO");
    getPermissions();
  }, []);

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              console.log("FOUND EXISTING");
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    navigate("/home");
  };

  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    if (message.trim() === "") return;
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let connect = () => {
    if (!username.trim()) return;
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-900 min-h-screen">
      {askForUsername === true ? (
        // --- LOBBY UI ---
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 items-center">
            <h2 className="text-3xl font-bold text-gray-800">Join Meeting</h2>

            <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner relative">
              <video
                ref={localVideoref}
                autoPlay
                muted
                className="w-full h-full object-cover -scale-x-100"
              ></video>
              {!videoAvailable && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Camera Disabled
                </div>
              )}
            </div>

            <TextField
              id="outlined-basic"
              label="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
              className="bg-gray-50 rounded-lg"
              onKeyPress={(e) => e.key === "Enter" && connect()}
            />

            <Button
              variant="contained"
              onClick={connect}
              size="large"
              fullWidth
              className="bg-blue-600! text-white! rounded-lg! py-3! hover:bg-blue-700! font-bold! text-lg! transition-all"
              disabled={!username.trim()}
            >
              Join Now
            </Button>
          </div>
        </div>
      ) : (
        // --- MEETING ROOM UI ---
        <div className="flex flex-col h-screen bg-[#202124] overflow-hidden">
          {/* TOP SECTION: Videos & Chat */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Video Grid */}
            <div className="flex-1 p-4 flex flex-wrap justify-center items-center gap-4 overflow-y-auto">
              {/* Local User Video */}
              <div className="relative bg-[#3c4043] rounded-xl overflow-hidden shadow-lg aspect-video grow max-w-200 min-w-75">
                <video
                  ref={localVideoref}
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${video ? "" : "hidden"}`}
                ></video>
                {!video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
                    <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-md">
                      {username.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm backdrop-blur-sm">
                  {username} (You)
                </div>
              </div>

              {/* Remote Videos */}
              {videos.map((vid) => (
                <div
                  key={vid.socketId}
                  className="relative bg-[#3c4043] rounded-xl overflow-hidden shadow-lg aspect-video grow max-w-200 min-w-75"
                >
                  <video
                    data-socket={vid.socketId}
                    ref={(ref) => {
                      if (ref && vid.stream) {
                        ref.srcObject = vid.stream;
                      }
                    }}
                    autoPlay
                    className="w-full h-full object-cover"
                  ></video>
                </div>
              ))}
            </div>

            {/* Chat Sidebar */}
            {showModal && (
              <div className="w-80 bg-white flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.15)] z-20">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    In-call Messages
                  </h3>
                  <IconButton
                    onClick={() => setModal(false)}
                    size="small"
                    className="hover:bg-gray-200"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>

                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50">
                  {messages.length !== 0 ? (
                    messages.map((item, index) => {
                      const isMe = item.sender === username;
                      return (
                        <div
                          key={index}
                          className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                        >
                          <span className="text-xs text-gray-500 mb-1 px-1">
                            {item.sender}
                          </span>
                          <div
                            className={`px-4 py-2 rounded-2xl shadow-sm ${
                              isMe
                                ? "bg-blue-600 text-white rounded-tr-sm"
                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                              {item.data}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center flex-col text-gray-400 gap-2">
                      <ChatIcon fontSize="large" className="opacity-50" />
                      <p>No messages yet. Say hi!</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white flex gap-2 items-center">
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Send a message..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    className="bg-gray-50 rounded-lg"
                    sx={{ "& fieldset": { borderRadius: "8px" } }}
                  />
                  <IconButton
                    color="primary"
                    onClick={sendMessage}
                    className="bg-blue-50! text-blue-600! hover:bg-blue-100!"
                    disabled={!message.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM CONTROL BAR */}
          <div className="h-20 bg-[#202124] border-t border-[#3c4043] flex items-center justify-center gap-4 px-6 z-30">
            <IconButton
              onClick={handleAudio}
              className={`p-3! rounded-full! transition-colors ${
                audio
                  ? "bg-[#3c4043]! text-white! hover:bg-[#434649]!"
                  : "bg-red-500! text-white! hover:bg-red-600!"
              }`}
            >
              {audio ? (
                <MicIcon fontSize="medium" />
              ) : (
                <MicOffIcon fontSize="medium" />
              )}
            </IconButton>

            <IconButton
              onClick={handleVideo}
              className={`p-3! rounded-full! transition-colors ${
                video
                  ? "bg-[#3c4043]! text-white! hover:bg-[#434649]!"
                  : "bg-red-500! text-white! hover:bg-red-600!"
              }`}
            >
              {video ? (
                <VideocamIcon fontSize="medium" />
              ) : (
                <VideocamOffIcon fontSize="medium" />
              )}
            </IconButton>

            {screenAvailable && (
              <IconButton
                onClick={handleScreen}
                className={`p-3! rounded-full! transition-colors ${
                  screen
                    ? "bg-blue-300! text-blue-900! hover:bg-blue-400!"
                    : "bg-[#3c4043]! text-white! hover:bg-[#434649]!"
                }`}
              >
                {screen ? (
                  <ScreenShareIcon fontSize="medium" />
                ) : (
                  <StopScreenShareIcon fontSize="medium" />
                )}
              </IconButton>
            )}

            <IconButton
              onClick={handleEndCall}
              className="bg-red-500! text-white! p-3! px-6! rounded-full! hover:bg-red-600! shadow-lg mx-2"
            >
              <CallEndIcon fontSize="medium" />
            </IconButton>

            <Badge badgeContent={newMessages} color="error">
              <IconButton
                onClick={() => {
                  setModal(!showModal);
                  setNewMessages(0);
                }}
                className={`p-3! rounded-full! transition-colors ${
                  showModal
                    ? "bg-blue-300! text-blue-900! hover:bg-blue-400!"
                    : "bg-[#3c4043]! text-white! hover:bg-[#434649]!"
                }`}
              >
                <ChatIcon fontSize="medium" />
              </IconButton>
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
