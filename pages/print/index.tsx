import Printable from '@/components/printable/printable'
import React, { useEffect, useRef, useState } from 'react'
import styles from './print.module.scss'
import QRCode from 'qrcode.react';
import { MdArrowBackIos, MdClear, MdOutlineClear } from 'react-icons/md';
import cx from 'classnames'
import axios from 'axios';
import { useRecoilState } from 'recoil';
import qrState from '@/store/atoms/qr';
import { BsEmojiAngry, BsEmojiSmile, BsEmojiWink } from 'react-icons/bs';

export default function Print() {
  const [fields, setFields] = useState({
    phone: "",
    numberString: ''
  })
  const date = new Date();
  const month = date.getMonth()+1
  const qrData = `phone:${fields.phone},website: www.mloganzila.or.tz`
  const [clicked,setClicked] = useState(false)
  const keys = [1,2,3,4,5,6,7,8,9,0];
  const [qr,setQrState] = useRecoilState<any>(qrState)
  const [printable, setPrintable] = useState(false)
  const [seleccted, setSelected] = useState({
    index: 0,
    reason: "",
    type: "",
 })
  // return (
  //   <div className={styles.print}>
  //     this is print
  //       {/* <Printable/> */}
  //   </div>
  // )
  const formRef = useRef<HTMLFormElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(()=> {
    if(printable){
      handlePrint()
    }
  },[printable])

  const handlePrint = () => {
    if (formRef.current) {
      console.log('printing please wait')
      const printWindow = window.open('', '', 'width=600,height=400');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Form</title>
              <style>
                /* Add any styles you need for printing */
              </style>
            </head>
            <body>
              ${formRef.current.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.onafterprint = () => {
          console.log('document printed successfully');
          setVisible(false); // Optionally, reset visibility here
        };
        printWindow.close();
      }
      // Optionally, reset visibility
      setVisible(false);
    }
  };
  const handleClearClick = () => {
    if (fields.numberString.length > 0) {
      setFields({...fields,numberString: fields.numberString.slice(0, -1)})
      //setFields({...fields,numberString: fields.numberString.slice(0, -1)})
    }
  };
  const handleNumberClick = (num:number) => {
    //setFields({...fields,numberString: num+fields.numberString})
    setFields({...fields,numberString: fields.numberString+num})
  };

  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("https://qms-back.mloganzila.or.tz/tickets/create_ticket",{disability: null,phone:fields.numberString})
    .then((data)=> {
        setQrState(data.data)
        setClicked(false)
        setPrintable(true)
        setFields({...fields,phone:"",numberString:""})
        setTimeout(()=> {
          setPrintable(false)
        },5000)
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            //alert(error.message);
        }
    })
  }

  return (
    <div className={styles.form_print}>
        {
          printable && (
            <form ref={formRef} style={{opacity:"0"}} className={styles.printer}>
          <h1>{qr.ticket_no}</h1>
          <div className={styles.qr}>
            <QRCode value={qrData}/>
          </div>
          <p className={styles.date}>{date.getDate().toString().padStart(2, '0') }/{month.toString().padStart(2, '0')}/{date.getUTCFullYear()}   <span>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span></p>
          <h6 style={{fontWeight: "600", fontSize: "20px", color:"blue"}}>www.mloganzila.or.tz</h6>
        </form>
          )
        }
        <div className={styles.items}>
            <div className={styles.icon}>
                <img src="/mnh.png" alt="" />
            </div>
            <div className={styles.item} onClick={()=> setClicked(true)}>
                <p>Chukua Tokeni</p>
            </div>
            <div className={styles.suggestions}>
                <div className={styles.title}>
                    <h3>Unaonaje Huduma Zetu?</h3>
                </div>
                <div className={styles.emojis}>
                  <div className={styles.emoti}>
                  <BsEmojiAngry size={60} className={styles.icon___}/>
                  </div>
                  <div className={styles.emoti}>
                  <BsEmojiSmile size={60} className={styles.icon___}/>
                  </div>
                  <div className={styles.emoti}>
                  <BsEmojiWink size={60} className={styles.icon___}/>
                  </div>
                </div>
            </div>
        </div>
        {
            clicked && (
                <div className={styles.overlay}>
                    <div className={cx(styles.content,clicked && styles.active)}>
                        <div className={styles.top}>
                            <h1>Ingiza Namba Ya Simu / Enter Phone Number</h1>
                        </div>
                        <div className={styles.contents}>
                            <div className={styles.bar}>
                                <div className={styles.left}>
                                <input
                                  type="text"
                                  value={fields.numberString}
                                  placeholder="0"
                                />
                                </div>
                                <div className={styles.right}>
                                <div className={styles.clear} onClick={()=> handleClearClick()}><MdArrowBackIos className={styles.icon} size={30}/></div>
                                <div className={styles.clear} onClick={()=> setFields({...fields,numberString: ""})}><MdOutlineClear className={styles.icon} size={30}/></div>
                                </div>
                            </div>
                            <div className={styles.keyBoard}>
                                {
                                    keys.map((item:number,index:number)=> (
                                        <div className={styles.key} key={index} onClick={()=> handleNumberClick(item)}>{item}</div>
                                    ))
                                }
                            </div>
                            <div className={styles.action}>
                                <button onClick={submit} type='submit'>Submit</button>
                                <div className={styles.cleara} onClick={()=> setClicked(false)}><MdClear className={styles.icona}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  );
}
