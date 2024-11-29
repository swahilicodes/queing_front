import React, { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import styles from './gpt.module.scss'
import cx from 'classnames'

interface NumberAudioPlayerProps {
  token: number;
  counter: number;
  isPlaying: boolean;
  stage: string
}

const GptPlayer: React.FC<NumberAudioPlayerProps> = ({ token, counter, isPlaying }) => {
  const [talking, setTalking] = useState(false)
  const [serving, setServing] = useState(0)
  const [counting, setCounting] = useState({
    namba: 0,
    token: 0
  })

  useEffect(()=> {
    console.log(counting)
    setCounting({...counting,namba: counting.namba+1, token: token})
    setServing(token)
    setInterval(()=> {
      refresh()
    },2000)
    const button = document.getElementById('play-button')
    if(isPlaying && button && !talking && serving !==0 && (counting.namba > 0 && counting.namba < 2)){
      setCounting({...counting,namba: counting.namba+1, token: token})
      button.click()
    }
  },[isPlaying,talking,serving,counting.namba])

  const refresh = () => {
    if(counting.namba > 0){
      if(counting.token !== token){
        setCounting({...counting,namba: 0, token: token})
      }
    }
  }

  const getAudioSequence = (number: number): string[] => {
    setTalking(true)
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/1000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0") {
        if (numString[2] === "1") {
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
        }else{
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

  const getAudioSequenceEnglish = (number: number): string[] => {
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push('/English/beep.mp3')
      audioSequence.push('/English/ticket.mp3')
      audioSequence.push(`/English/1000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/English/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0") {
        if (numString[2] === "1") {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        } else {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        }
      }if ( numString[3] !== "0") {
        //audioSequence.push(`/English/na.mp3`);
        audioSequence.push(`/English/${numString[3]}.mp3`);
        audioSequence.push(`/English/counter.mp3`);
      }else{
        audioSequence.push(`/English/counter.mp3`);
      }
    } else if (length === 3) {
      audioSequence.push('/English/beep.mp3')
      audioSequence.push('/English/ticket.mp3')
      audioSequence.push(`/English/${numString[0]}00.mp3`);
      if (numString[1] !== "0") {
        if(numString[2] === "0"){
            //audioSequence.push(`/English/na.mp3`);
            audioSequence.push(`/English/${numString[1]}0.mp3`);
        }else{
            audioSequence.push(`/English/${numString[1]}0.mp3`);
        }
      }else{
        if(numString[1]==="0" && numString[2]==="0"){
            audioSequence.push(`/English/counter.mp3`);  
        }
      }
      if ( numString[2] !== "0") {
        //audioSequence.push(`/English/na.mp3`);
        audioSequence.push(`/English/${numString[2]}.mp3`);
        audioSequence.push(`/English/counter.mp3`);
      }else{
        if(numString[1] !== "0"){
            audioSequence.push(`/English/counter.mp3`);
        }
      }
    } else if (length === 2) {
        audioSequence.push('/English/beep.mp3')
        audioSequence.push('/English/ticket.mp3')
        audioSequence.push(`/English/${numString[0]}0.mp3`);
        if (numString[1] !== "0") {
          //audioSequence.push(`/English/na.mp3`);
          audioSequence.push(`/English/${numString[1]}.mp3`);
          audioSequence.push(`/English/counter.mp3`);
        }else{
            audioSequence.push(`/English/counter.mp3`);
        }
    } else if (length === 1) {
      audioSequence.push('/English/beep.mp3')
      audioSequence.push('/English/ticket.mp3')
      audioSequence.push(`/English/${numString}.mp3`);
      audioSequence.push(`/English/counter.mp3`);
    }

    return audioSequence;
  };
  const getCounterEnglish = (number: number): string[] => {
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push(`/English/1000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/English/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0") {
        if (numString[2] === "1") {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        } else {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        }
      }if ( numString[3] !== "0") {
        //audioSequence.push(`/English/na.mp3`);
        audioSequence.push(`/English/${numString[3]}.mp3`);
      }
    } else if (length === 3) {
      audioSequence.push(`/English/${numString[0]}00.mp3`);
      if (numString[1] !== "0") {
        if(numString[2] === "0"){
            //audioSequence.push(`/English/na.mp3`);
            audioSequence.push(`/English/${numString[1]}0.mp3`);
        }else{
            audioSequence.push(`/English/${numString[1]}0.mp3`);
        }
      }
      if ( numString[2] !== "0") {
        //audioSequence.push(`/English/na.mp3`);
        audioSequence.push(`/English/${numString[2]}.mp3`);
      }
    } else if (length === 2) {
        audioSequence.push(`/English/${numString[0]}0.mp3`);
        if (numString[1] !== "0") {
          //audioSequence.push(`/English/na.mp3`);
          audioSequence.push(`/English/${numString[1]}.mp3`);
        }
    } else if (length === 1) {
      audioSequence.push(`/English/${numString}.mp3`);
    }

    return audioSequence;
  };
  const getCounterSwahili = (number: number): string[] => {
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push(`/Edited/1000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0") {
        if (numString[2] === "1") {
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        } else {
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        }
      }if ( numString[3] !== "0") {
        //audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[3]}.mp3`);
      }
    } else if (length === 3) {
      audioSequence.push(`/Edited/${numString[0]}00.mp3`);
      if (numString[1] !== "0") {
        if(numString[2] === "0"){
            //audioSequence.push(`/Edited/na.mp3`);
            audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }else{
            audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }
      }
      if ( numString[2] !== "0") {
        //audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[2]}.mp3`);
      }
    } else if (length === 2) {
        audioSequence.push(`/Edited/${numString[0]}0.mp3`);
        if (numString[1] !== "0") {
          //audioSequence.push(`/Edited/na.mp3`);
          audioSequence.push(`/Edited/${numString[1]}.mp3`);
        }
    } else if (length === 1) {
      audioSequence.push(`/Edited/${numString}.mp3`);
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

  const PlayThem = async () => {
    await playAudioSequence(getAudioSequence(token))
    await playAudioSequence(getCounterSwahili(counter))
    await playAudioSequence(getAudioSequenceEnglish(token))
    await playAudioSequence(getCounterEnglish(counter))
    setTalking(false)
    setServing(0)
  }

  return <div className={styles.gpt}>
    {/* <button onClick={PlayThem} className={cx(talking && styles.talking)}>{talking
    ?<FaPause className={styles.icon} size={30}/>
    :<FaPlay className={styles.icon} size={30}/>}
    </button> */}
    {
      isPlaying
      ?<button onClick={PlayThem} className={cx(talking && styles.talking)} id="play-button">{talking
        ?<FaPause className={styles.icon} size={30}/>
        :<FaPlay className={styles.icon} size={30}/>}
        </button>
      : <p>waiting..</p>
    }
  </div>;
};

export default GptPlayer;
