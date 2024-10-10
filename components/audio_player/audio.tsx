import React, { useRef, useState, useEffect } from 'react';

interface SequentialAudioPlayerProps {
  audioFiles: string[];
  token: string,
  counter: string
}

const SequentialAudioPlayer: React.FC<SequentialAudioPlayerProps> = ({ audioFiles, token, counter }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [individualNumbers, setIndividualNumbers] = useState<string[]>([]);
  const [counterFiles, setCounterFiles] = useState<string[]>([]);
  //const [tokens, setTokens] = useState<HTMLAudioElement[] | null>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [counts, setCounts] = useState<string[]>([]);
  const [mteja, setMteja] = useState(false)
  const [namba, setNamba] = useState(false)
  const [nenda, setNenda] = useState(false)
  const [dirisha, setDirisha] = useState(false)

  useEffect(() => {
    setIndNumbers(),
    setIndCounters()
  }, []);

  const setIndNumbers = () => {
    const numbers = token.split('');
    setIndividualNumbers(numbers);
    if(individualNumbers.length> 0){
        console.log('individual numbers are ',individualNumbers)
    }
  }
  const setIndCounters = () => {
    const numbers = counter.split('');
    setCounterFiles(numbers);
    if(counterFiles.length> 0){
        console.log('individual numbers are ',individualNumbers)
    }
  }

  const tokenFiles = () => {
        let idadi = 0
    if(individualNumbers.length !== 0){
        for (let i=0; i<individualNumbers.length; i++){
            idadi = i
            if(individualNumbers[i]==="0"){
                tokens?.push("/audio/moja.mp3")
                console.log('idadi is ',idadi)
            }else if(individualNumbers[i]==="1"){
                tokens?.push("/audio/moja.mp3")
            }else if(individualNumbers[i]==="2"){
                tokens?.push("/audio/mbili.mp3")
            }else if(individualNumbers[i]==="3"){
                tokens?.push("/audio/tatu.mp3")
            }else if(individualNumbers[i]==="4"){
                tokens?.push("/audio/nne.mp3")
            }else if(individualNumbers[i]==="5"){
                tokens?.push("/audio/tano.mp3")
            }else if(individualNumbers[i]==="6"){
                tokens?.push("/audio/sita.mp3")
            }else if(individualNumbers[i]==="7"){
                tokens?.push("/audio/saba.mp3")
            }else if(individualNumbers[i]==="8"){
                tokens?.push("/audio/nane.mp3")
            }else if(individualNumbers[i]==="9"){
                tokens?.push("/audio/tisa.mp3")
            }
        }
        if(idadi >= individualNumbers.length-1){
            playAudioSequentially(tokens)
        }
    }
  }
  const countingFiles = () => {
        let idadi = 0
    console.log(counterFiles)
    if(counterFiles.length !== 0){
        for (let i=0; i<counterFiles.length; i++){
            idadi = i
            if(counterFiles[i]==="0"){
                counts?.push("/audio/moja.mp3")
                console.log('idadi is ',idadi)
            }else if(counterFiles[i]==="1"){
                counts?.push("/audio/moja.mp3")
            }else if(counterFiles[i]==="2"){
                counts?.push("/audio/mbili.mp3")
            }else if(counterFiles[i]==="3"){
                counts?.push("/audio/tatu.mp3")
            }else if(counterFiles[i]==="4"){
                counts?.push("/audio/nne.mp3")
            }else if(counterFiles[i]==="5"){
                counts?.push("/audio/tano.mp3")
            }else if(counterFiles[i]==="6"){
                counts?.push("/audio/sita.mp3")
            }else if(counterFiles[i]==="7"){
                counts?.push("/audio/saba.mp3")
            }else if(counterFiles[i]==="8"){
                counts?.push("/audio/nane.mp3")
            }else if(counterFiles[i]==="9"){
                counts?.push("/audio/tisa.mp3")
            }
        }
        if(idadi >= counterFiles.length-1){
            playAudioSequentially(counts)
        }
    }
  }

  const playAudioSequentially = async (files:string[]) => {
    console.log('sequences are ',files)
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
    await playAudioSequentially(tokens);
    await playAudioSequentially(counts);
    // countingFiles();
    await playOne("/audio/nenda.mp3");
  }

  return (
    <div>
      <button onClick={playThem}>play All</button>
      <button onClick={countingFiles}>play</button>
    </div>
  );
};

export default SequentialAudioPlayer;
