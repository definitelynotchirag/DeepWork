import { useState } from "react";
import "./App.css";
import { VideoRoom } from "./components/VideoRoom";
import { Button, Container, Paper, Title } from "@mantine/core";
// import { MessageRoom } from "./components/MessageRoom";
// import MessageRoom from './components/MessageRoom';

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="App">
      <Title order={1} style={{ marginBottom: "0.5rem", color: "#ffff" }}>
        DeepWork
      </Title>
      <h2 size="lg" color="gray" style={{ marginBottom: "1rem" }}>
        Focused work, uninterrupted.
      </h2>

      {!joined && (
        <div>
          <h2>
            A Comprehensive Collaborative Studying App With Video Calls, Timers
            and Realtime Chat
          </h2>
          <Button
            variant="filled"
            color="grape"
            size="md"
            radius="md"
            onClick={() => setJoined(true)}
          >
            Join A Public Room
          </Button>
        </div>
      )}

      {joined && (
        <>
          <Button
            variant="filled"
            color="grape"
            size="md"
            radius="md"
            onClick={() => setJoined(false)}
          >
            Back to Lobby
          </Button>
          <VideoRoom />
        </>
      )}

      {/* <MessageRoom /> */}
    </div>
  );
}

export default App;
