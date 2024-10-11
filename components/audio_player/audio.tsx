import React, { useState, useEffect } from 'react';
import styles from './audio.module.scss'
import { PiSpeakerHighLight } from 'react-icons/pi';
import { useRouter } from 'next/router';

interface SequentialAudioPlayerProps {
  token: string,
  counter: string
}

const SequentialAudioPlayer: React.FC<SequentialAudioPlayerProps> = ({ token, counter }) => {
  const [individualNumbers, setIndividualNumbers] = useState<string[]>([]);
  const [counterFiles, setCounterFiles] = useState<string[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const router = useRouter()

  useEffect(() => {
    setIndNumbers(),
    setIndCounters()
  }, []);

  const setIndNumbers = () => {
    const numbers = token.split('');
    setIndividualNumbers(numbers);
  }
  const setIndCounters = () => {
    const numbers = counter.split('');
    setCounterFiles(numbers);
  }

  const tokenFiles = async () => {
    let idadi = 0;
    if (individualNumbers.length !== 0) {
        for (let i = 0; i < individualNumbers.length; i++) {
            idadi = i;
            if (individualNumbers[i] === "0") {
                tokens?.push("/audio/moja.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "1") {
                tokens?.push("/audio/moja.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "2") {
                tokens?.push("/audio/mbili.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "3") {
                tokens?.push("/audio/tatu.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "4") {
                tokens?.push("/audio/nne.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "5") {
                tokens?.push("/audio/tano.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "6") {
                tokens?.push("/audio/sita.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "7") {
                tokens?.push("/audio/saba.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "8") {
                tokens?.push("/audio/nane.mp3");
                setTokens(tokens)
            } else if (individualNumbers[i] === "9") {
                tokens?.push("/audio/tisa.mp3");
                setTokens(tokens)
            }
        }
        if (idadi >= individualNumbers.length - 1) {
            await playAudioSequentially(tokens);
        }
    }
};

  const countingFiles = async () => {
    let idadi = 0;
    const counts = []; 
    if (counterFiles.length !== 0) {
      for (let i = 0; i < counterFiles.length; i++) {
        idadi = i;
        if (counterFiles[i] === "0") {
          counts.push("/audio/moja.mp3");
        } else if (counterFiles[i] === "1") {
          counts.push("/audio/moja.mp3");
        } else if (counterFiles[i] === "2") {
          counts.push("/audio/mbili.mp3");
        } else if (counterFiles[i] === "3") {
          counts.push("/audio/tatu.mp3");
        } else if (counterFiles[i] === "4") {
          counts.push("/audio/nne.mp3");
        } else if (counterFiles[i] === "5") {
          counts.push("/audio/tano.mp3");
        } else if (counterFiles[i] === "6") {
          counts.push("/audio/sita.mp3");
        } else if (counterFiles[i] === "7") {
          counts.push("/audio/saba.mp3");
        } else if (counterFiles[i] === "8") {
          counts.push("/audio/nane.mp3");
        } else if (counterFiles[i] === "9") {
          counts.push("/audio/tisa.mp3");
        }
      }
  
      // Check if all files are processed
      if (idadi >= counterFiles.length - 1) {
        // Assuming playAudioSequentially is an async function, await it
        await playAudioSequentially(counts);
      }
    }
  };
  

  const playAudioSequentially = async (files:string[]) => {
    for (let i = 0; i < files.length; i++) {
      const audio = new Audio(files[i]);
      await new Promise((resolve) => {
        audio.play();
        audio.onended = resolve;
        if(i >= files.length-1){
            resolve
          }
      });
    }
  };
  const playOne= async (file:string) => {
    return new Promise((resolve)=> {
        const audio = new Audio(file)
        if(audio){
            audio.play();
            audio.onended = resolve
        }
    })
  };

  async function playThem() {
    await playOne("/audio/mteja.mp3");
    await tokenFiles()
    await playOne("/audio/nenda.mp3");
    await countingFiles();
    router.reload()
  }

  return (
    <div className={styles.audio_player}>
        <div className={styles.player} onClick={playThem}>
            <PiSpeakerHighLight className={styles.icon} size={40}/>
        </div>
    </div>
  );
};

export default SequentialAudioPlayer;
