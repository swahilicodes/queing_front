import AudioTest from '@/components/audio_player/audio_test/audio'
import React, { useEffect, useState } from 'react'

interface SequentialAudioPlayerProps {
    token: string,
    counter: string,
    stage: string,
    isButton: boolean
  }

const SequentialAudio: React.FC<SequentialAudioPlayerProps> = ({ token, counter, stage, isButton }) => {
//function AudioPage() {
  const [nambaz, setNambaz] = useState<string[]>([])
  //const nambaz: string[] = []
  const [fields, setFields] = useState({
    length: 0,
    number: "",
    nambas: []
  })

  useEffect(()=> {
    play()
  },[token])
  function getNumberLength(num: number): number {
    return num.toString().length;
  }
  const play = async () => {
    if(getNumberLength(Number(token))===4){
      const nambas = token.toString().split('').map(String)
      nambaz.push('/audio/before.mp3')
      nambaz.push('/Edited/tiketi.mp3')
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/Edited/${nambas[i]}000.mp3`)
        }else if(i===1){
          if(nambas[i]==="0"){
            nambaz.push("/Edited/silence.mp3")
            nambaz.push(`/Edited/na.mp3`)
          }else{
            nambaz.push(`/Edited/${nambas[i]}00.mp3`)
          }
        }else if(i===2){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
            nambaz.push(`/Edited/na.mp3`)
          }else{
            nambaz.push(`/Edited/${nambas[i]}0.mp3`)
          }
        }else if(i===3){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
            nambaz.push('/Edited/dirisha.mp3')
          }else{
            nambaz.push(`/Edited/na.mp3`)
            nambaz.push(`/Edited/${nambas[i]}.mp3`)
            nambaz.push('/Edited/dirisha.mp3')
          }
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(token))===3){
      const nambas = token.toString().split('').map(String)
      nambaz.push('/audio/before.mp3')
      nambaz.push('/Edited/tiketi.mp3')
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
          }else{
            nambaz.push(`/Edited/${nambas[i]}00.mp3`)
          }
        }else if(i===1){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
          }else{
            nambaz.push(`/Edited/${nambas[i]}0.mp3`)
          }
        }else if(i===2){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
            nambaz.push('/Edited/dirisha.mp3')
          }else{
            nambaz.push(`/Edited/na.mp3`)
            nambaz.push(`/Edited/${nambas[i]}.mp3`)
            nambaz.push('/Edited/dirisha.mp3')
          }
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(token))===2){
      const nambas = token.toString().split('').map(String)
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
          }else{
            nambaz.push(`/Edited/${nambas[i]}0.mp3`)
          }
        }else if(i===1){
          if(nambas[i]==="0"){
            nambaz.push(`/Edited/silence.mp3`)
          }else{
            nambaz.push(`/Edited/na.mp3`)
            nambaz.push(`/Edited/${nambas[i]}.mp3`)
          }
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(token))===1){
      const nambas = token.toString().split('').map(String)
      for (let i = 0; i < nambas.length; i++){
        if(i===0){
          nambaz.push(`/Edited/${nambas[i]}.mp3`)
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
    <div id='player'>play</div>
  )
}

export default SequentialAudio