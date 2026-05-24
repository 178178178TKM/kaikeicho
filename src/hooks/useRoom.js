// src/hooks/useRoom.js
import { useState, useEffect } from 'react';

const ROOM_PARAM = 'room';
const ID_LENGTH = 16;
const VALID_RE = /^[A-Za-z0-9]{16}$/;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateId() {
  const arr = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => CHARS[b % CHARS.length]).join('');
}

function readHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const id = params.get(ROOM_PARAM);
  return VALID_RE.test(id) ? id : null;
}

export function useRoom() {
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    let id = readHash();
    if (!id) {
      id = generateId();
      history.replaceState(null, '', `${window.location.pathname}#${ROOM_PARAM}=${id}`);
    }
    setRoomId(id);
  }, []);

  return roomId;
}
