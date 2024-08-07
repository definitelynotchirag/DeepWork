// components/VideoChat.js
import { useState, useEffect, useRef } from 'react';
import LobbyForm from './LobbyForm';
import './videos.css'; 

const APP_ID = "YOUR-APP-ID"; // Replace with your Agora App ID

export default function VideoChat() {
  const [token, setToken] = useState(null);
  const [uid] = useState(String(Math.floor(Math.random() * 10000)));
  const [roomId, setRoomId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const user1Ref = useRef(null);
  const user2Ref = useRef(null);

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
    ]
  };

  const constraints = {
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 }
    },
    audio: true
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const room = urlParams.get('room');
    if (!room) {
      <LobbyForm/>
    } else {
      setRoomId(room);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      init();
    }
    return () => {
      leaveChannel();
    };
  }, [roomId]);

  const init = async () => {
    const client = AgoraRTM.createInstance(APP_ID);
    await client.login({ uid, token });

    const channel = client.createChannel(roomId);
    await channel.join();

    channel.on('MemberJoined', handleUserJoined);
    channel.on('MemberLeft', handleUserLeft);
    client.on('MessageFromPeer', handleMessageFromPeer);

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    user1Ref.current.srcObject = stream;
  };

  const handleUserLeft = () => {
    if (user2Ref.current) {
      user2Ref.current.style.display = 'none';
    }
    if (user1Ref.current) {
      user1Ref.current.classList.remove('smallFrame');
    }
  };

  const handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);

    if (message.type === 'offer') {
      await createAnswer(MemberId, message.offer);
    }

    if (message.type === 'answer') {
      await addAnswer(message.answer);
    }

    if (message.type === 'candidate') {
      if (peerConnection) {
        peerConnection.addIceCandidate(message.candidate);
      }
    }
  };

  const handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId);
    await createOffer(MemberId);
  };

  const createPeerConnection = async (MemberId) => {
    const pc = new RTCPeerConnection(servers);
    setPeerConnection(pc);

    const remoteStream = new MediaStream();
    setRemoteStream(remoteStream);
    if (user2Ref.current) {
      user2Ref.current.srcObject = remoteStream;
      user2Ref.current.style.display = 'block';
    }

    if (user1Ref.current) {
      user1Ref.current.classList.add('smallFrame');
    }

    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setLocalStream(stream);
      if (user1Ref.current) {
        user1Ref.current.srcObject = stream;
      }
    }

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        client.sendMessageToPeer(
          { text: JSON.stringify({ type: 'candidate', candidate: event.candidate }) },
          MemberId
        );
      }
    };
  };

  const createOffer = async (MemberId) => {
    await createPeerConnection(MemberId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'offer', offer }) },
      MemberId
    );
  };

  const createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'answer', answer }) },
      MemberId
    );
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(answer);
    }
  };

  const leaveChannel = async () => {
    if (channel) {
      await channel.leave();
    }
    if (client) {
      await client.logout();
    }
  };

  const toggleCamera = async () => {
    const videoTrack = localStream?.getTracks().find(track => track.kind === 'video');
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      document.getElementById('camera-btn').style.backgroundColor = videoTrack.enabled ? 'rgb(179, 102, 249, .9)' : 'rgb(255, 80, 80)';
    }
  };

  const toggleMic = async () => {
    const audioTrack = localStream?.getTracks().find(track => track.kind === 'audio');
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      document.getElementById('mic-btn').style.backgroundColor = audioTrack.enabled ? 'rgb(179, 102, 249, .9)' : 'rgb(255, 80, 80)';
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', leaveChannel);
    return () => {
      window.removeEventListener('beforeunload', leaveChannel);
    };
  }, []);

  return (
    <div>
      <video id="user-1" ref={user1Ref} autoPlay muted></video>
      <video id="user-2" ref={user2Ref} autoPlay></video>
      <button id="camera-btn" onClick={toggleCamera}>Toggle Camera</button>
      <button id="mic-btn" onClick={toggleMic}>Toggle Mic</button>
    </div>
  );
}
