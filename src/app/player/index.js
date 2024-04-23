"use client";
import { FaPlay, FaPause, FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { GoPlay } from "react-icons/go";
import { RxEnterFullScreen } from "react-icons/rx";
import { PiSubtitlesFill } from "react-icons/pi";
import { MdSubtitlesOff } from "react-icons/md";
import { BiCaptions } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { CiPlay1 } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import styles from "./player.module.css";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setMute] = useState(true);
  const [isSubsOff, setSubs] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [speed, setSpeed] = useState(1);
  

  const videoPlayer = useRef();
  const progressBar = useRef();
  const volumeBar = useRef();
  const animationRef = useRef();
  const chapters = [
    {
      start: 0,
      end: 249,
      title: "Introduction",
    },
    {
      start: 250,
      end: 682.597969,
      title: "Teenagers",
    },
  ];

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    videoPlayer.current.playbackRate = speed;
    playbackspeed(); 
    setShowMenu(false); // Hide the menu after selecting a speed
  };

  useEffect(() => {
    const seconds = Math.floor(videoPlayer.current.duration);
    setDuration(seconds);
    console.log(videoPlayer.current.duration);
    console.log(calculateTime(duration));
    progressBar.current.max = seconds;
    console.log(calculateTime(videoPlayer.current.currentTime));
  }, [videoPlayer?.current?.loadedmetadata, videoPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    videoPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    setCurrentTime(progressBar.current.value);
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      videoPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      videoPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };
  const whilePlaying = () => {
    progressBar.current.value = videoPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const volumeControlOnOff = () => {
    console.log(currentVolume);
    setMute(!isMuted);
    if (isMuted) {
      videoPlayer.current.volume = 0;
      volumeBar.current.value = 0;
      volumeBar.current.style.setProperty("--seek-before-width", "0%");
    } else {
      videoPlayer.current.volume = currentVolume;
      volumeBar.current.value = currentVolume * 100;
      volumeBar.current.style.setProperty(
        "--seek-before-width",
        `${currentVolume * 100}%`
      );
    }
  };

  const changeVolume = () => {
    videoPlayer.current.volume = volumeBar.current.value / 100;
    setCurrentVolume(volumeBar.current.value / 100);
    volumeBar.current.value == 0 ? setMute(false) : setMute(true);
    volumeBar.current.style.setProperty(
      "--seek-before-width",
      `${volumeBar.current.value}%`
    );
  };

  const openFullscreen = () => {
    if (videoPlayer.current.requestFullscreen) {
      videoPlayer.current.requestFullscreen();
    } else if (videoPlayer.current.webkitRequestFullscreen) {
      /* Safari */
      videoPlayer.current.webkitRequestFullscreen();
    } else if (videoPlayer.current.msRequestFullscreen) {
      /* IE11 */
      videoPlayer.current.msRequestFullscreen();
    }
  };

  const toggleSubtitles = () => {
    setSubs(!isSubsOff);
    console.log(videoPlayer.current.textTracks[0].mode);
    if (!isSubsOff) {
      videoPlayer.current.textTracks[0].mode = "showing";
    } else {
      videoPlayer.current.textTracks[0].mode = "hidden";
    }
    console.log(videoPlayer.current.textTracks[0].mode);
  };

  const playbackspeed = () => {
    console.log(videoPlayer.current.playbackRate);
  };

  return (
    <div className="relative m-12">
      <div className="relative items-center ml-auto mr-auto w-4/5">
        {!isPlaying && (
          <CiPlay1 
            className="text-white w-24 h-24 items-center absolute m-auto left-0 right-0 top-0 bottom-0 "
            onClick={togglePlayPause}
          />
          
        )}

        <video
          ref={videoPlayer}
          width="100%"
          height="100%"
          onClick={togglePlayPause}
          className={styles.video}
        >
          <source src="unpopular_opinions.mp4" type="video/mp4" />
          {/* 
          <track
            src="SpaceOdyssey.vtt"
            kind="subtitles"
            srclang="en"
            label="English"
            default
          ></track>
          */}
          Your browser does not support the video tag.
        </video>
        <div className="justify-between items-center absolute bottom-0 text-white w-full">
          {hoveredChapter && (
            <div className="pl-24">{hoveredChapter.title}</div>
          )}
          <div className="w-full flex items-center pr-10 pl-10">
            <p className="pr-3"> {calculateTime(currentTime)}</p>
            <div className={styles.progressbarWrapper}>
              <input
                ref={progressBar}
                type="range"
                defaultValue={0}
                onChange={changeRange}
                //className="w-full rounded-full h-1"
                className={styles.progressbar}
              ></input>
              {chapters.map((chapter, i) => {
                const leftStyle = (chapter.start / duration) * 100;
                const widthStyle =
                  ((chapter.end - chapter.start) / duration) * 100;
                return (
                  <div
                    onMouseEnter={() => setHoveredChapter(chapter)}
                    onMouseLeave={() => setHoveredChapter(null)}
                    onClick={() => setHoveredChapter(chapter)}
                    key={i}
                    className={styles.chapter}
                    value={chapter.title}
                    style={{
                      "--left": `${leftStyle}%`,
                      "--width": `${widthStyle}%`,
                    }}
                  ></div>
                );
              })}
            </div>
            <p className="pl-3">
              {" "}
              {duration && !isNaN(duration) && calculateTime(duration)}
            </p>
          </div>
          <div className="flex items-center justify-between pr-10 pl-10">
            <div className="flex items-center pt-2 pb-4">
              <button onClick={togglePlayPause} className="pr-4">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={volumeControlOnOff} className="pr-4">
                {isMuted ? <FaVolumeHigh /> : <FaVolumeXmark />}
              </button>
              <input
                ref={volumeBar}
                type="range"
                defaultValue={100}
                onChange={changeVolume}
                //className="w-16 rounded-full h-1"
                className={styles.volumebar}
              ></input>
              {/** 
              <div className="flex items-center justify-between">
                <p>
                  {calculateTime(currentTime)} /{" "}
                  {duration && !isNaN(duration) && calculateTime(duration)}
                </p>
              </div>
              */}
            </div>
            <div className="flex items-center pt-2 pb-4">
              {/** 
            <button onClick={toggleSubtitles}>
              {isSubsOff ? <PiSubtitlesFill />:<MdSubtitlesOff/>}
            </button>
            */}
              
              <button onClick={() => setShowMenu(!showMenu)} className="pr-4">
                <IoMdSettings />
              </button>
              <button onClick={openFullscreen}>
                <RxEnterFullScreen />
              </button>
            </div>
          </div>
        </div>
    
      </div>
      {showMenu && (
                <div className="flex absolute w-64 b-0 left-3/4">
                  <button className="pr-2" onClick={() => handleSpeedChange(0.5)}>0.5x</button>
                  <button className="pr-2" onClick={() => handleSpeedChange(1)}>Normal</button>
                  <button className="pr-2" onClick={() => handleSpeedChange(1.5)}>1.5x</button>
                  <button className="pr-2" onClick={() => handleSpeedChange(2)}>2x</button>
                </div>
              )}
    </div>
  );
}
