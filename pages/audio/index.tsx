import AudioTest from '@/components/audio_player/audio_test/audio'
import React, { useState } from 'react'

function AudioPage() {
  const [nambaz, setNambaz] = useState<string[]>([])
  //const nambaz: string[] = []
  const [fields, setFields] = useState({
    length: 0,
    number: "",
    nambas: []
  })
  function getNumberLength(num: number): number {
    return num.toString().length;
  }
  const play = async () => {
    if(getNumberLength(Number(fields.number))===4){
      const nambas = fields.number.toString().split('').map(String)
      //nambaz.push('/mwana/tileti.mp3')
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/mwana/${nambas[i]}000.mp3`)
          // if(nambas.indexOf(nambas[i])===0){
          //   console.log(nambas.indexOf(nambas[i]))
          // }else{
          //   nambaz.push(`/mwana/${nambas[i]}000.mp3`)
          // }
        }else if(i===1){
          nambaz.push(`/mwana/${nambas[i]}00.mp3`)
        }else if(i===2){
          nambaz.push(`/mwana/${nambas[i]}0.mp3`)
        }else if(i===3){
          nambaz.push(`/mwana/na.mp3`)
          nambaz.push(`/mwana/${nambas[i]}.mp3`)
          //nambaz.push('/mwana/dirisha.mp3')
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(fields.number))===3){
      const nambas = fields.number.toString().split('').map(String)
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/mwana/${nambas[i]}00.mp3`)
        }else if(i===1){
          nambaz.push(`/mwana/${nambas[i]}0.mp3`)
        }else if(i===2){
          nambaz.push(`/mwana/na.mp3`)
          nambaz.push(`/mwana/${nambas[i]}.mp3`)
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(fields.number))===2){
      const nambas = fields.number.toString().split('').map(String)
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/mwana/${nambas[i]}0.mp3`)
        }else if(i===1){
          nambaz.push(`/mwana/na.mp3`)
          nambaz.push(`/mwana/${nambas[i]}.mp3`)
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(fields.number))===1){
      const nambas = fields.number.toString().split('').map(String)
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/mwana/${nambas[i]}.mp3`)
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }
  }

  const playAudioSequentially = async (files:string[]) => {
    for (let i = 0; i < files.length; i++) {
      const audio = new Audio(files[i]);
      await new Promise((resolve) => {
        audio.play();
        audio.onended = resolve;
        if(i >= files.length-1){
            resolve
            setNambaz([])
          }
      });
    }
  };
  return (
    <div id='player'>
      <input 
      type="text" 
      value={fields.number}
      onChange={e => setFields({...fields,number: e.target.value})}
      />
      <h1>Number Length: {getNumberLength(Number(fields.number))}</h1>
      <button onClick={play}>Play It</button>
      {/* <AudioTest token='037' counter='100' stage='meds' isButton={false}/> */}
    </div>
  )
}

export default AudioPage