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
  const [countering, setCountering] = useState({
    namba: 0,
    token: 0,
  })

  useEffect(() => {
  if (isPlaying) {
    setCountering({namba: counting.namba+1,token})
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


  // const getAudioSequence = (number: number): string[] => {
  //   setTalking(true)
  //   const numString = number.toString();
  //   const length = numString.length;
  //   const audioSequence: string[] = [];
  //   if (length === 4) {
  //     audioSequence.push('/Glad/beep.mp3')
  //     audioSequence.push('/Glad/tiketi.mp3')
  //     audioSequence.push(`/Glad/${numString[0]}000.mp3`);
  //     if (numString[1] !== "0") {
  //       audioSequence.push(`/Glad/${numString[1]}00.mp3`);
  //     }
  //     if (numString[2] !== "0" || numString[3] !== "0") {
  //       audioSequence.push(`/Glad/na.mp3`);
  //       if (numString[2] !== "0") {
  //         audioSequence.push(`/Glad/${numString[2]}0.mp3`);
  //       }
  //       if (numString[3] !== "0") {
  //         audioSequence.push(`/Glad/${numString[3]}.mp3`);
  //       }
  //     }
  //     audioSequence.push(stage === "clinic" ? `/Glad/chumba.mp3` : `/Glad/dirisha.mp3`);
  //   } else if (length === 3) {
  //     audioSequence.push('/Glad/beep.mp3')
  //     audioSequence.push('/Glad/tiketi.mp3')
  //     audioSequence.push(`/Glad/${numString[0]}00.mp3`);
  //     if (numString[1] !== "0" || numString[2] !== "0") {
  //       audioSequence.push(`/Glad/na.mp3`);
  //       if (numString[1] !== "0") {
  //         audioSequence.push(`/Glad/${numString[1]}0.mp3`);
  //       }
  //       if (numString[2] !== "0") {
  //         audioSequence.push(`/Glad/${numString[2]}.mp3`);
  //       }
  //     }
  //     audioSequence.push(stage === "clinic" ? `/Glad/chumba.mp3` : `/Glad/dirisha.mp3`);
  //   } else if (length === 2) {
  //     audioSequence.push('/Glad/beep.mp3')
  //     audioSequence.push('/Glad/tiketi.mp3')
  //     audioSequence.push(`/Glad/${numString[0]}0.mp3`);
  //     if (numString[1] !== "0") {
  //       audioSequence.push(`/Glad/na.mp3`);
  //       audioSequence.push(`/Glad/${numString[1]}.mp3`);
  //     }
  //     audioSequence.push(stage === "clinic" ? `/Glad/chumba.mp3` : `/Glad/dirisha.mp3`);
  //   } else if (length === 1) {
  //     audioSequence.push('/Glad/beep.mp3')
  //     audioSequence.push('/Glad/tiketi.mp3')
  //     audioSequence.push(`/Glad/${numString}.mp3`);
  //     audioSequence.push(stage === "clinic" ? `/Glad/chumba.mp3` : `/Glad/dirisha.mp3`);
  //   }

  //   return audioSequence;
  // };

const getAudioSequence = (number: number): string[] => {
  setTalking(true);
  const numString = number.toString().padStart(4, '0'); // Pad to 4 digits
  const audioSequence: string[] = [];
  audioSequence.push('/Glad/tiketi.mp3');
  const thousands = parseInt(numString[0]);
  if (thousands > 0) {
    audioSequence.push(`/Glad/${thousands}000.mp3`); // e.g., 1000.mp3 for "elfu moja"
  }

  // Hundreds
  const hundreds = parseInt(numString[1]);
  if (hundreds > 0) {
    audioSequence.push(`/Glad/${hundreds}00.mp3`); // e.g., 100.mp3 for "mia moja"
  }

  // Tens and units
  const tens = parseInt(numString[2]);
  const units = parseInt(numString[3]);

  // Handle tens and units
  if (thousands > 0 || hundreds > 0 || tens > 0) {
    if (tens === 1) {
  if (units === 0) {
    audioSequence.push('/Glad/10.mp3'); // Play "kumi" for 10
  } else {
    audioSequence.push('/Glad/10.mp3'); // e.g., 10.mp3 for "kumi"
    audioSequence.push('/Glad/na.mp3'); // "and"
    audioSequence.push(`/Glad/${units}.mp3`); // e.g., 2.mp3 for "mbili"
  }
} else {
  // Tens
  if (tens > 1) {
    audioSequence.push(`/Glad/${tens}0.mp3`); // e.g., 50.mp3 for "hamsini"
  }
  // Add "na" if there are units and either thousands, hundreds, or tens are non-zero
  if (units > 0 && (thousands > 0 || hundreds > 0 || tens > 0)) {
    audioSequence.push('/Glad/na.mp3'); // "and"
  }
  // Units
  if (units > 0) {
    audioSequence.push(`/Glad/${units}.mp3`); // e.g., 3.mp3 for "tatu"
  }
}
    // if (tens === 1 && units > 0) {
    //   audioSequence.push(`/Glad/10.mp3`); // e.g., 10.mp3 for "kumi"
    //   if (units > 0) {
    //     audioSequence.push('/Glad/na.mp3'); // "and"
    //     audioSequence.push(`/Glad/${units}.mp3`); // e.g., 2.mp3 for "mbili"
    //   }
    // } else {
    //   // Tens
    //   if (tens > 1) {
    //     audioSequence.push(`/Glad/${tens}0.mp3`); // e.g., 50.mp3 for "hamsini"
    //   }
    //   // Add "na" if there are units and either thousands, hundreds, or tens are non-zero
    //   if (units > 0 && (thousands > 0 || hundreds > 0 || tens > 0)) {
    //     audioSequence.push('/Glad/na.mp3'); // "and"
    //   }
    //   // Units
    //   if (units > 0) {
    //     audioSequence.push(`/Glad/${units}.mp3`); // e.g., 3.mp3 for "tatu"
    //   }
    // }
  } else if (units > 0) {
    // Only units non-zero (e.g., 0004): just add the unit
    audioSequence.push(`/Glad/${units}.mp3`); // e.g., 4.mp3 for "nne"
  }

  // Ending based on stage
  audioSequence.push(stage === 'clinic' ? '/Glad/chumba.mp3' : '/Glad/dirisha.mp3');

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
      audioSequence.push(`/Glad/1000.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Glad/${numString[1]}00.mp3`);
      }
      if (numString[2] !== "0" || numString[3] !== "0") {
        audioSequence.push(`/Glad/na.mp3`);
        if (numString[2] !== "0") {
          audioSequence.push(`/Glad/${numString[2]}0.mp3`);
        }
        if (numString[3] !== "0") {
          audioSequence.push(`/Glad/${numString[3]}.mp3`);
        }
      }
    } else if (length === 3) {
      audioSequence.push(`/Glad/${numString[0]}00.mp3`);
      if (numString[1] !== "0" && numString[2] !== "0") {
        audioSequence.push(`/Glad/na.mp3`);
        if (numString[1] !== "0") {
          audioSequence.push(`/Glad/${numString[1]}0.mp3`);
        }
        if (numString[2] !== "0") {
          audioSequence.push(`/Glad/${numString[2]}.mp3`);
        }
      }
    } else if (length === 2) {
      audioSequence.push(`/Glad/${numString[0]}0.mp3`);
      if (numString[1] !== "0") {
        audioSequence.push(`/Glad/na.mp3`);
        audioSequence.push(`/Glad/${numString[1]}.mp3`);
      }
    } else if (length === 1) {
      audioSequence.push(`/Glad/${numString}.mp3`);
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
    const audio = new Audio("/Glad/beep.mp3");
      await audio.play();
      await new Promise((resolve) => {
        audio.onended = resolve;
      });
    // await playAudioSequence(getAudioSequenceEnglish(token))
    // await playAudioSequence(getCounterEnglish(counter))
    await playAudioSequence(getAudioSequence(token))
    await playAudioSequence(getCounterSwahili(counter))
    // await playAudioSequence(getAudioSequence(token))
    // await playAudioSequence(getCounterSwahili(counter))
    setTalking(false)
    axios.post("http://192.168.30.246:5005/speaker/delete_play", { id: id }).then((data: any) => {
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
