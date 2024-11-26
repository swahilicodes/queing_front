import React, { useEffect } from "react";

interface NumberAudioPlayerProps {
  token: number;
  counter: number; // Counter can be used to trigger re-renders if needed
}

const GptPlayer: React.FC<NumberAudioPlayerProps> = ({ token, counter }) => {

  const getAudioSequence = (number: number): string[] => {
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/1000.mp3`); // "one thousand"
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/${numString[1]}00.mp3`); // Hundreds (e.g., "three hundred")
      }
      if (numString[2] !== "0") {
        if (numString[2] === "1") {
        //   audioSequence.push(`/Edited/${numString[2]}${numString[3]}.mp3`);
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        } else {
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        }
      }if ( numString[3] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[3]}.mp3`);
        audioSequence.push(`/Edited/dirisha.mp3`);
      }else{
        audioSequence.push(`/Edited/dirisha.mp3`);
      }
    } else if (length === 3) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString[0]}00.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        if(numString[2] === "0"){
            audioSequence.push(`/Edited/na.mp3`);
            audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }else{
            audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }
      }else{
        if(numString[1]==="0" && numString[2]==="0"){
            audioSequence.push(`/Edited/dirisha.mp3`);  
        }
      }
      if ( numString[2] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[2]}.mp3`);
        audioSequence.push(`/Edited/dirisha.mp3`);
      }else{
        if(numString[1] !== "0"){
            audioSequence.push(`/Edited/dirisha.mp3`);
        }
      }
    } else if (length === 2) {
        audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
        audioSequence.push(`/Edited/${numString[0]}0.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/Edited/na.mp3`);
          audioSequence.push(`/Edited/${numString[1]}.mp3`);
          audioSequence.push(`/Edited/dirisha.mp3`);
        }
    } else if (length === 1) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString}.mp3`);
      audioSequence.push(`/Edited/dirisha.mp3`);
    }

    return audioSequence;
  };

  // Function to play audio sequentially
  const playAudioSequence = async (audioFiles: string[]) => {
    for (const file of audioFiles) {
      const audio = new Audio(file);
      await audio.play();
      await new Promise((resolve) => {
        audio.onended = resolve;
      });
    }
  };

  useEffect(() => {
    // const audioSequence = getAudioSequence(token);
    // playAudioSequence(audioSequence);
  }, [token, counter]);

  return <div>
    <button onClick={()=> playAudioSequence(getAudioSequence(token))}>Play</button>
  </div>;
};

export default GptPlayer;
