import isSpeakerState from '@/store/atoms/isSpeaker'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styles from './sequential.module.scss'
import { IoPlayOutline } from 'react-icons/io5'
import { FaRegCirclePause } from 'react-icons/fa6'
import cx from 'classnames'

interface SequentialAudioPlayerProps {
    token: string,
    counter: string,
    stage: string,
    isButton: boolean,
    talking: boolean,
  }

const SequentialAudio: React.FC<SequentialAudioPlayerProps> = ({ token, counter, stage, isButton, talking }) => {
 const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
 //const [isSpeaker, setSpeaker] = useState(false)
//function AudioPage() {
  const [nambaz, setNambaz] = useState<string[]>([])
  //const nambaz: string[] = []
  const [fields, setFields] = useState({
    length: 0,
    number: "",
    nambas: []
  })

  useEffect(()=> {
    // if(talking && !isButton) {
    //     if(token || counter){
    //         setTimeout(()=> {
    //             play()
    //         },3000)
    //     }
    // }
  },[token,counter,talking,isSpeaker])
  function getNumberLength(num: number): number {
    return num.toString().length;
  }

  function removeLeadingZeros(input: string): string {
    return input.replace(/^0+/, '') || '0';
  }
  const play = async () => {
    setTimeout(()=> {
      console.log('is it talking? ',talking)
    },2000)
    if(getNumberLength(Number(removeLeadingZeros(token)))===4){
      const nambas = removeLeadingZeros(token).toString().split('').map(String)
      nambaz.push('/Edited/beep.mp3')
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
            await playCounterOrRoom()
          }
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
        await playCounterOrRoom()
        setSpeaker(false)
      }
    }else if(getNumberLength(Number(removeLeadingZeros(token)))===3){
      const nambas = removeLeadingZeros(token).toString().split('').map(String)
      nambaz.push('/Edited/beep.mp3')
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
        await playCounterOrRoom()
        setSpeaker(false)
      }
    }else if(getNumberLength(Number(removeLeadingZeros(token)))===2){
      const nambas = removeLeadingZeros(token).toString().split('').map(String)
      nambaz.push('/Edited/beep.mp3')
      nambaz.push('/Edited/tiketi.mp3')
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
            nambaz.push(`/Edited/dirisha.mp3`)
          }
        }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
        await playCounterOrRoom()
        setSpeaker(false)
      }
    }else if(getNumberLength(Number(removeLeadingZeros(token)))===1){
      const nambas = removeLeadingZeros(token).toString().split('').map(String)
      nambaz.push('/Edited/beep.mp3')
      nambaz.push('/Edited/tiketi.mp3')
      for (let i = 0; i < nambas.length; i++){
        nambaz.push(`/Edited/${nambas[i]}.mp3`)
        nambaz.push(`/Edited/dirisha.mp3`)
        // if(i===0){
        //   nambaz.push(`/Edited/silence.mp3`)
        // }else{
        //     nambaz.push(`/Edited/${nambas[i]}.mp3`)
        //     nambaz.push(`/Edited/dirisha.mp3`)
        // }
      }
      if(nambaz.length>= nambas.length){
        playAudioSequentially(nambaz)
        await playCounterOrRoom()
        setSpeaker(false)
      }
    }
  }
  const playCounterOrRoom = async () => {
    if(getNumberLength(Number(removeLeadingZeros(counter)))===4){
      const nambas = removeLeadingZeros(counter).toString().split('').map(String)
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
        await playAudioSequentially(nambaz)
      }
    }else if(getNumberLength(Number(removeLeadingZeros(counter)))===3){
      const nambas = removeLeadingZeros(counter).toString().split('').map(String)
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
    }else if(getNumberLength(Number(removeLeadingZeros(counter)))===2){
      const nambas = removeLeadingZeros(counter).toString().split('').map(String)
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
    }else if(getNumberLength(Number(removeLeadingZeros(counter)))===1){
      const nambas = removeLeadingZeros(counter).toString().split('').map(String)
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
    <div className={styles.sequential}>
        {
            isButton
            ? <div className={cx(styles.button, isSpeaker && styles.talking)} onClick={()=> play()}>
                {
                    isSpeaker
                    ? <FaRegCirclePause className={styles.icon} size={30}/>
                    :<IoPlayOutline className={styles.icon} size={30}/>
                }
            </div>
            : <div className={styles.button}>
                {
                    talking
                    ? <FaRegCirclePause/>
                    :<IoPlayOutline/>
                }
            </div>
        }
    </div>
  )
}

export default SequentialAudio
