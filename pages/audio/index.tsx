import { useRef, useState } from "react";

const AudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [textForTTS, setTextForTTS] = useState("");
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const files = Array.from(audioFiles);
      files[index] = e.target.files[0];
      setAudioFiles(files);
    }
  };

  // Play audios and TTS in sequence
  const playSequence = () => {
    if (audioRef1.current && audioRef2.current) {
      // Play first audio
      audioRef1.current.play();

      // After first audio ends, play the second one
      audioRef1.current.onended = () => {
        audioRef2.current?.play();
      };

      // After second audio ends, trigger TTS
      audioRef2.current.onended = () => {
        if (textForTTS) {
          speakText(textForTTS);
        }
      };
    }
  };

  // Text-to-Speech function using Web Speech API
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h1>Audio and TTS Player</h1>

      <div>
        <label>Upload First Audio: </label>
        <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 0)} />
      </div>

      <div>
        <label>Upload Second Audio: </label>
        <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 1)} />
      </div>

      <div>
        <label>Enter Text for TTS: </label>
        <input
          type="text"
          value={textForTTS}
          onChange={(e) => setTextForTTS(e.target.value)}
        />
      </div>

      <button onClick={playSequence}>Play Sequence</button>

      {/* Audio elements (hidden) */}
      {audioFiles[0] && <audio ref={audioRef1} src={URL.createObjectURL(audioFiles[0])} />}
      {audioFiles[1] && <audio ref={audioRef2} src={URL.createObjectURL(audioFiles[1])} />}
    </div>
  );
};

export default AudioPlayer;
