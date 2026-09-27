import React from 'react';
import { createRoot } from 'react-dom/client';
import WhiteboardApp from './WhiteboardApp.jsx';
import './whiteboard.css';

createRoot(document.getElementById('whiteboard-root')).render(<WhiteboardApp />);
