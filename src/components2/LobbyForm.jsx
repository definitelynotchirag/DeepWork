// components/LobbyForm.js
import { useState } from 'react';
import './lobby.css'; // Import your CSS file

export default function LobbyForm() {
  const [inviteLink, setInviteLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inviteLink) {
      window.location.href = `index.html?room=${inviteLink}`;
    }
  };

  return (
    <main id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>

        <div id="form__content__wrapper">
          <form id="join-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="invite_link"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              required
            />
            <input type="submit" value="Join Room" />
          </form>
        </div>
      </div>
    </main>
  );
}
