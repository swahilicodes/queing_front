import React, { useState, useEffect } from 'react';
import styles from './audio.module.scss'
import { PiSpeakerHighLight } from 'react-icons/pi';
import { useRouter } from 'next/router';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import cx from 'classnames'

interface SequentialAudioPlayerProps {
  token: string,
  counter: string,
  stage: string,
  isButton: boolean
}

const AudioTest: React.FC<SequentialAudioPlayerProps> = ({ token, counter, stage, isButton }) => {
  const [individualNumbers, setIndividualNumbers] = useState<string[]>([]);
  const [counterFiles, setCounterFiles] = useState<string[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [isCalling, setCalling] = useState(false)
  const audios = "/mp3/"
  const [fields, setFields] = useState({
    token: "",
    counter: ""
  })
  const router = useRouter()

  useEffect(() => {
    fetchFiles()
    setIndNumbers(),
    setIndCounters()
    setFields({...fields,token: token,counter: counter})
  }, [fields.counter,fields.token]);

  const setIndNumbers = () => {
    const numbers = fields.token.split('');
    setIndividualNumbers(numbers);
  }
  const setIndCounters = () => {
    const numbers = fields.counter.split('');
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
            tokens.slice(0)
            setFields({...fields,token:""})
        }
    }
};

  const countingFiles = async () => {

    // let idadi = 0;
    // let counts = []; 
    // if (counterFiles.length !== 0) {
    //   for (let i = 0; i < counterFiles.length; i++) {
    //     idadi = i;
    //     if (counterFiles[i] === "0") {
    //       counts.push("/audio/moja.mp3");
    //     } else if (counterFiles[i] === "1") {
    //       counts.push("/audio/moja.mp3");
    //     } else if (counterFiles[i] === "2") {
    //       counts.push("/audio/mbili.mp3");
    //     } else if (counterFiles[i] === "3") {
    //       counts.push("/audio/tatu.mp3");
    //     } else if (counterFiles[i] === "4") {
    //       counts.push("/audio/nne.mp3");
    //     } else if (counterFiles[i] === "5") {
    //       counts.push("/audio/tano.mp3");
    //     } else if (counterFiles[i] === "6") {
    //       counts.push("/audio/sita.mp3");
    //     } else if (counterFiles[i] === "7") {
    //       counts.push("/audio/saba.mp3");
    //     } else if (counterFiles[i] === "8") {
    //       counts.push("/audio/nane.mp3");
    //     } else if (counterFiles[i] === "9") {
    //       counts.push("/audio/tisa.mp3");
    //     }
    //   }
  
    //   // Check if all files are processed
    //   if (idadi >= counterFiles.length - 1) {
    //     // Assuming playAudioSequentially is an async function, await it
    //     await playAudioSequentially(counts);
    //     counts = []
    //     setFields({...fields,counter: ""})
    //   }
    // }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/audiofiles');
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching files:', error);
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
  const playToken= async (data: string) => {
    return new Promise((resolve)=> {
      const aud = removeLeadingZeros(data)
      const audio = new Audio(`/mp3/${aud}.mp3`)
        if(audio){
            audio.play();
            audio.onended = resolve
        }
    })
  };
  const playCounter= async () => {
    return new Promise((resolve)=> {
      const aud = removeLeadingZeros(counter)
        if(stage==="clinic"){
          const audio = new Audio("/mp3/elekea_chumba_number.mp3")
          if(audio){
            audio.play();
            audio.onended = resolve
        }
        }else{
          const audio = new Audio("/mp3/elekea_dirisha_number.mp3")
          if(audio){
            audio.play();
            audio.onended = resolve
        }
        }
    })
  };

  function removeLeadingZeros(value: string | number): number {
    const strValue = String(value);
    const result = strValue.replace(/^0+/, '');
    return Number(result);
  }

  async function playThem() {
    if(!isCalling){
      setCalling(true)
      await playOne("/audio/before.m4a");
      await playOne("/audio/before.m4a");
      await playOne("/mp3/mwenye_card_number.mp3");
      await playToken(token)
      await playCounter();
      await playToken(counter)
      setFields({...fields,token:"",counter: ""})
      setCalling(false)
    }
  }

  return (
    <div className={styles.audio_player01}>
        <div className={styles.player} onClick={playThem}>
            {
              isButton
              ? <div className={styles.button}>Call</div>
              : <div className={cx(styles.icon,isCalling && styles.calling)}>
                {
                  !isCalling
                  ? <HiOutlineSpeakerWave className={styles.icon__} size={30}/>
                  : <HiOutlineSpeakerXMark className={styles.icon__} size={30}/>
                }
              </div>
            }
        </div>
    </div>
  );
};

export default AudioTest;
