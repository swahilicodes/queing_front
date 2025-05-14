import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import styles from './gpt.module.scss'
import cx from 'classnames'
import axios from "axios";

interface NumberAudioPlayerProps {
  token: number;
  counter: number;
  isPlaying: boolean;
  stage: string,
  id: number
}

const GptPlayer: React.FC<NumberAudioPlayerProps> = ({ token, counter, isPlaying, stage, id }) => {
  const [talking, setTalking] = useState(false)
  const [serving, setServing] = useState(0)
  const [counting, setCounting] = useState({
    namba: 0,
    token: 0,
    id: 0
  })

  useEffect(() => {
  if (isPlaying) {
    if (counting.namba === 0 || counting.id !== id) {
      // Play audio if it's the first play (namba === 0) or if id is different
      PlayThem();
      setCounting({ namba: counting.namba + 1, token, id });
    } else if (counting.token !== token) {
      // Reset namba if token changes (but id is the same)
      setCounting({ namba: 0, token, id });
    } else {
      console.log(`Audio skipped: token ${token}, serving ${serving}, id ${id}`);
    }
  }
}, [isPlaying, token, id, counting.namba, counting.id, counting.token, serving]);
  // useEffect(() => {
  //   console.log(counting.id,id,token,counting.token)
  //   if (isPlaying) {
  //     // if (counting.namba <= 1) {
  //     if (counting.namba <= 1 ) {
  //       PlayThem()
  //       setCounting({ ...counting, namba: counting.namba + 1, token: token,id: id })
  //     }else if(counting.namba > 1 && counting.id != id){
  //       PlayThem()
  //       setCounting({ ...counting, namba: counting.namba + 1, token: token,id: id })
  //     } else {
  //       console.log(`token ${token}, serving ${serving}`)
  //       if (token !== serving) {
  //         setCounting({ ...counting, namba: 0, token: token })
  //       }
  //     }
  //   }
  // }, [isPlaying, talking, token, counting.namba])


  const getAudioSequence = (number: number): string[] => {
    setTalking(true)
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];
    if (length === 4) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString[0]}000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0" || numString[3] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        if (numString[2] !== "0") {
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        }
        if (numString[3] !== "0") {
          audioSequence.push(`/Edited/${numString[3]}.mp3`);
        }
      }
      audioSequence.push(stage === "clinic" ? `/Edited/chumba.mp3` : `/Edited/dirisha.mp3`);
    } else if (length === 3) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString[0]}00.mp3`);
      if (numString[1] !== "0" || numString[2] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }
        if (numString[2] !== "0") {
          audioSequence.push(`/Edited/${numString[2]}.mp3`);
        }
      }
      audioSequence.push(stage === "clinic" ? `/Edited/chumba.mp3` : `/Edited/dirisha.mp3`);
    } else if (length === 2) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString[0]}0.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[1]}.mp3`);
      }
      audioSequence.push(stage === "clinic" ? `/Edited/chumba.mp3` : `/Edited/dirisha.mp3`);
    } else if (length === 1) {
      audioSequence.push('/Edited/beep.mp3')
      audioSequence.push('/Edited/tiketi.mp3')
      audioSequence.push(`/Edited/${numString}.mp3`);
      audioSequence.push(stage === "clinic" ? `/Edited/chumba.mp3` : `/Edited/dirisha.mp3`);
    }

    return audioSequence;
  };

  const getAudioSequenceEnglish = (number: number): string[] => {
    const numString = number.toString();
    const length = numString.length;
    const audioSequence: string[] = [];

    audioSequence.push('/English/beep.mp3');
    audioSequence.push('/English/ticket.mp3');

    if (length === 4) {
      audioSequence.push(`/English/${numString[0]}000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/English/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0" || numString[3] !== "0") {
        audioSequence.push('/English/and.mp3');
        if (numString[2] !== "0") {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        }
        if (numString[3] !== "0") {
          audioSequence.push(`/English/${numString[3]}.mp3`);
        }
      }
    } else if (length === 3) {
      audioSequence.push(`/English/${numString[0]}00.mp3`);
      if (numString[1] !== "0" || numString[2] !== "0") {
        audioSequence.push('/English/and.mp3');
        if (numString[1] !== "0") {
          audioSequence.push(`/English/${numString[1]}0.mp3`);
        }
        if (numString[2] !== "0") {
          audioSequence.push(`/English/${numString[2]}.mp3`);
        }
      }
    } else if (length === 2) {
      if (numString[0] === '1' && numString[1] !== '0') {
        audioSequence.push(`/English/${numString}.mp3`);
      } else {
        audioSequence.push(`/English/${numString[0]}0.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/English/${numString[1]}.mp3`);
        }
      }
    } else if (length === 1) {
      audioSequence.push(`/English/${numString}.mp3`);
    }

    audioSequence.push(stage === 'clinic' ? '/English/room.mp3' : '/English/counter.mp3');
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
      if (numString[2] !== "0" || numString[3] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        if (numString[2] !== "0") {
          audioSequence.push(`/Edited/${numString[2]}0.mp3`);
        }
        if (numString[3] !== "0") {
          audioSequence.push(`/Edited/${numString[3]}.mp3`);
        }
      }
    } else if (length === 3) {
      audioSequence.push(`/Edited/${numString[0]}00.mp3`);
      if (numString[1] !== "0" && numString[2] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/Edited/${numString[1]}0.mp3`);
        }
        if (numString[2] !== "0") {
          audioSequence.push(`/Edited/${numString[2]}.mp3`);
        }
      }
    } else if (length === 2) {
      audioSequence.push(`/Edited/${numString[0]}0.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Edited/na.mp3`);
        audioSequence.push(`/Edited/${numString[1]}.mp3`);
      }
    } else if (length === 1) {
      audioSequence.push(`/Edited/${numString}.mp3`);
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
      if (numString[2] !== "0" || numString[3] !== "0") {
        audioSequence.push(`/English/and.mp3`);
        if (numString[2] !== "0") {
          audioSequence.push(`/English/${numString[2]}0.mp3`);
        }
        if (numString[3] !== "0") {
          audioSequence.push(`/English/${numString[3]}.mp3`);
        }
      }
    } else if (length === 3) {
      audioSequence.push(`/English/${numString[0]}00.mp3`);
      if (numString[1] !== "0" || numString[2] !== "0") {
        audioSequence.push(`/English/and.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/English/${numString[1]}0.mp3`);
        }
        if (numString[2] !== "0") {
          audioSequence.push(`/English/${numString[2]}.mp3`);
        }
      }
    } else if (length === 2) {
      audioSequence.push(`/English/${numString[0]}0.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/English/${numString[1]}.mp3`);
      }
    } else if (length === 1) {
      audioSequence.push(`/English/${numString}.mp3`);
    }

    return audioSequence;
  };

  const playAudioSequence = async (audioFiles: string[]) => {
    for (const file of audioFiles) {
      const audio = new Audio(file);
      await audio.play();
      await new Promise((resolve) => {
        audio.onended = resolve;
      });
    }
  };

  const PlayThem = async () => {
    setServing(token)
    await playAudioSequence(getAudioSequence(token))
    await playAudioSequence(getCounterSwahili(counter))
    await playAudioSequence(getAudioSequenceEnglish(token))
    await playAudioSequence(getCounterEnglish(counter))
    setTalking(false)
    axios.post("http://localhost:5000/speaker/delete_play", { id: id }).then((data: any) => {
      console.log(`audio with id ${data.id} deleted successfully`)
    })
  }

  return <div className={styles.gpt}>
    {
      isPlaying
        ? <button onClick={PlayThem} className={cx((talking && isPlaying) && styles.talking)} id="play-button">{talking
          ? <FaPause className={styles.icon} size={30} />
          : <FaPlay className={styles.icon} size={30} />}
        </button>
        : <p>waiting..</p>
    }
  </div>;
};

export default GptPlayer;
