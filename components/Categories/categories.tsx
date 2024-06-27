import React, { useState } from 'react'
import styles from './categories.module.scss'
import { MdOutlineClear } from 'react-icons/md'
import { IoChevronForwardSharp } from 'react-icons/io5'
import QRCode from 'qrcode.react'
import axios from 'axios'

export default function Categories() {
  const categories = ["Cardiology","AutoGraphy","Pyschiatric","Medicinal","Hospital"]
  const [cat,setcat] = useState("")
  const [clicked,setClicked] = useState(false)
  const [isQr,setQr] = useState(false)
  const keys = [1,2,3,4,5,6,7,8,9,0];
  const [numberString, setNumberString] = useState('');
  const qrData = `"+255755875436,hello there`;

  const enterNumber = (cat:string,) => {
    setcat(cat)
    setClicked(true)
  }

  const handleNumberClick = (num:number) => {
    setNumberString(numberString + num);
  };

  const handleClearClick = () => {
    if (numberString.length > 0) {
      setNumberString(numberString.slice(0, -1));
    }
  };

  const generateQr = () => {
    window.print()
    // setInterval(()=> {
    //     setClicked(false)
    //     setQr(true)
    // },2000)
  }

  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/tickets/create_ticket",{category: cat,phone:numberString})
    .then((data:any)=> {
        console.log(data)
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
    <div className={styles.categories}>
        <div className={styles.top}>
            <div className={styles.item}>
                <div className={styles.logo}></div>
            </div>
        </div>
        {
            isQr && (<div>
                <QRCode value={qrData} />
              </div>)
        }
        {
            clicked && (
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <h1>Ingiza Namba Ya Simu / Enter Phone Number</h1>
                        </div>
                        <div className={styles.contents}>
                            <div className={styles.bar}>
                                <div className={styles.left}>{numberString.trim()===''?0:numberString}</div>
                                <div className={styles.right} onClick={()=> handleClearClick()}><MdOutlineClear className={styles.icon}/></div>
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
                                <div className={styles.cleara} onClick={()=> setClicked(false)}><IoChevronForwardSharp className={styles.icona}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        <div className={styles.items}>
            {
                categories.map((item:string,index:number)=> (
                    <div className={styles.item} key={index} onClick={()=> enterNumber(item)}>{item}</div>
                ))
            }
        </div>
    </div>
  )
}
