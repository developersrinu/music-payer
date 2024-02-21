import React, { useState, useEffect, useRef } from 'react';
import { GiLoveSong } from "react-icons/gi";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { ImPause2 } from "react-icons/im";

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
    setAudioFiles(storedAudioFiles);
    
    const lastPlayedIndex = localStorage.getItem('lastPlayedIndex');
    if (lastPlayedIndex) {
      setCurrentTrackIndex(parseInt(lastPlayedIndex));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('audioFiles', JSON.stringify(audioFiles));
  }, [audioFiles]);

  useEffect(() => {
    if (audioFiles.length > 0) {
      playAudio(audioFiles[currentTrackIndex].url);
    }
  }, [currentTrackIndex]);

  const playAudio = (url) => {
    audioRef.current.src = url;
    audioRef.current.play();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newAudio = {
        name: file.name,
        url: reader.result
      };
      setAudioFiles(prevAudioFiles => [...prevAudioFiles, newAudio]);
    };
    reader.readAsDataURL(file);
  };

  const handlePlayNext = () => {
    const newIndex = (currentTrackIndex + 1) % audioFiles.length;
    setCurrentTrackIndex(newIndex);
    localStorage.setItem('lastPlayedIndex', newIndex);
  };

  const handlePlayPrev = () => {
    const newIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
    setCurrentTrackIndex(newIndex);
    localStorage.setItem('lastPlayedIndex', newIndex);
  };

  function handleList(index){
       setCurrentTrackIndex(index)
  }

  return (
    <div className='main'>
      <div className='songs'>
        <div>
          <div className='addSong'>
            <label htmlFor='songInput'>
              <GiLoveSong />
              <span>Add your song</span>
            </label>
            <input
              id='songInput'
              type='file'
              style={{ display: 'none' }}
              onChange={handleInputChange}
            />
          </div>

          {audioFiles.map((audio, index) => (
            <div className='song' key={index} onClick={()=>handleList(index)}>
              <div><GiLoveSong/></div>
              <div>{audio.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='song-info-div'>
        <div className='song-info'>
          <div className='songImg'>
            <div><GiLoveSong className='icon'/></div>
            <div className='song-name'>{audioFiles[currentTrackIndex]?.name || 'No song selected'}</div>
          </div>
          <div className='op'>
            <span className='pre' onClick={handlePlayPrev}><TbPlayerTrackPrevFilled/></span>
            <span className='pause'><ImPause2/></span>
            <span className='next' onClick={handlePlayNext}><TbPlayerTrackNextFilled/></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;













