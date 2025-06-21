import React from 'react';
import './WorkspaceGallery.css';

const workspaceImages = [
  "https://i.imgur.com/gJ78p5F.jpg",
  "https://i.imgur.com/VWikgi9.jpg",
  "https://i.imgur.com/NaVgP6f.jpg",
  "https://i.imgur.com/Z8np1tP.jpg",
  "https://i.imgur.com/DVhY5Z1.jpg",
  "https://i.imgur.com/v0pdgma.jpg",
  "https://i.imgur.com/hQoW0R6.jpg",
  "https://i.imgur.com/HhX7WJw.jpg",
  "https://i.imgur.com/lSe43am.jpg",
  "https://i.imgur.com/StfRd76.jpg",
  "https://i.imgur.com/QtfeEO9.jpg",
  "https://i.imgur.com/uhF7ktY.jpg",
  "https://i.imgur.com/wk3KmeL.jpg",
  "https://i.imgur.com/K6mMSDf.jpg",
  "https://i.imgur.com/iMrvVLb.jpg",
  "https://i.imgur.com/Vij1TyP.jpg"
];

export default function WorkspaceGallery() {
  return (
    <div className="gallery-grid">
      {workspaceImages.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`workspace-${index + 1}`}
          crossOrigin="anonymous"
          className="gallery-img"
          loading="lazy"
        />
      ))}
    </div>
  );
}