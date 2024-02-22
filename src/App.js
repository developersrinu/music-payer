import React, { useState, useEffect, useRef } from 'react';
import { GiLoveSong } from "react-icons/gi";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { ImPause2, ImPlay2 } from "react-icons/im";
import a1 from './music/classical.mp3' 
import a2 from './music/countdown_30_second.mp3' 


const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

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
    setIsPlaying(true);
  };

  const MAX_FILE_SIZE_MB = 5;

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`);
      return; // Do not proceed with adding the file
    }
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

  function handleList(index) {
    setCurrentTrackIndex(index);
  }

  function stop() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
            <div className='song' key={index} onClick={() => handleList(index)}>
              <div><GiLoveSong/></div>
              <div className='name'>{audio.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='song-info-div'>
        <div className='song-info'>
          <div className='songImg'>
            <div><GiLoveSong className='icon' style={{color:'white'}}/></div>
            <div className='song-name' style={{color:'white'}}>{audioFiles[currentTrackIndex]?.name || 'No song selected'}</div>
          </div>
          <div className='op'>


         
            <span className='pre' onClick={handlePlayPrev}><TbPlayerTrackPrevFilled/></span>
            <span className='pause' onClick={stop}>{isPlaying ? <ImPause2/> : <ImPlay2/>}</span>
            <span className='next' onClick={handlePlayNext}><TbPlayerTrackNextFilled/></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
















