import React, { useEffect, useRef } from 'react'
import styles from './printable.module.scss'
import { useRecoilState, useRecoilValue } from 'recoil'
import qrState from '@/store/atoms/qr'
import QRCode from 'qrcode.react'
import { useRouter } from 'next/router'
import jsPDF from 'jspdf'
import * as htmlToImage from 'html-to-image';



function Printable({data}:any) {
 const [qr,setQr] = useRecoilState<any>(qrState)
 const date = new Date(qr.createdAt);
 const qrData = `phone:${qr.phone},clinic:${qr.category}`
 const router = useRouter()
 const formRef = useRef<HTMLFormElement>(null);
 
 useEffect(()=> {
    //convert1()
    setInterval(()=> {
        router.push('/')
    },5000)
 },[])
  // const convert1 = () => {
  //   const formData:any = formRef.current;
  //   htmlToImage.toPng(formData)
  // .then(async function (dataUrl) {
  //   var img = new Image();
  //   img.src = dataUrl;
  //   var doc = new jsPDF();
  //   var img = new Image();
  //   img.onload = function() {
  //       var imgWidth = doc.internal.pageSize.getWidth();
  //       var imgHeight = img.height * imgWidth / img.width;
  //       doc.addImage(dataUrl, 0, 0, imgWidth, imgHeight);
  //       doc.save("ticket.pdf")
  //   };
  //   img.src = dataUrl;
  // }).catch((error)=> {
  //   console.error('oops, something went wrong!', error.message);
  // })
  // }
  return (
    <div className={styles.printable}>
        <form id='myFrame' ref={formRef}>
            <h1>MNH MLOGANZILA</h1>
            <div className={styles.contents}>
            <h2>{qr.ticket_no}</h2>
            <div className={styles.qr}><QRCode value={qrData} /></div>
            <p>Karibu Hospitali ya Taifa Muhimbili Mloganzila</p>
            </div>
            <p className={styles.date}>{date.getDay()}/{date.getMonth()+1}/{date.getUTCFullYear()}   <span>{date.getHours()}:{date.getMinutes()}</span></p>
        </form>
    </div>
  )
}

export default Printable