import React, { useRef, useState } from 'react'
import styles from './queue_add.module.scss'
import { MdClear, MdOutlineClear } from 'react-icons/md'
import { IoChevronForwardSharp } from 'react-icons/io5'
import QRCode from 'qrcode.react'
import axios from 'axios'
import Printable from '../../components/printable/printable'
import { useRouter } from 'next/router'
import Print from '@/pages/print'
import { useRecoilState } from 'recoil'
import qrState from '@/store/atoms/qr'
import { IoMdCheckmark } from 'react-icons/io'
import jsPDF from 'jspdf'
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import cx from 'classnames'
import useFetchData from '@/custom_hooks/fetch'
import html2canvas from 'html2canvas'
import io from 'socket.io-client'

export default function QueueAdd() {
  const {data:services,loading,error} = useFetchData("http://localhost:5000/services/get_all_services")
  const [cat,setcat] = useState("")
  const [clicked,setClicked] = useState(false)
  const [isQr,setQr] = useState(false)
  const keys = [1,2,3,4,5,6,7,8,9,0];
  const [numberString, setNumberString] = useState('');
  const [qr,setQrState] = useRecoilState<any>(qrState)
  const [isSuccess, setSuccess] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null);
  const date = new Date(qr.createdAt);
  const month = date.getMonth()+1
 const qrData = `phone:${qr.phone},clinic:${qr.category}`
 const socket = io('http://localhost:5000');
 const [disabled, setDisabled] = useState('')
 const [index,setIndex] = useState(0)
 const [items, setItems] = useState([
    { id: 1, name: 'mzee', isActive: false },
    { id: 2, name: 'mjamzito', isActive: false },
    { id: 3, name: 'mlemavu', isActive: false },
  ]);
 const sags = [
    {
        id: 1,
        name: 'Mzee'
    },
    {
        id: 2,
        name: 'Mjamzito'
    },
    {
        id: 3,
        name: 'Mlemavu'
    },
 ]

 const changeSag = (id:any,data:string) => {
    if(index===id){
        setIndex(0)
        setDisabled('')
    }else{
        setIndex(id)
        setDisabled(data)
    }
 }

  const handleClick = (id:any) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isActive: true } : { ...item, isActive: false }
      )
    );
  };

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

  const changeColor = (index:number,stata:string) => {
    setIndex(index)
    setDisabled(stata)
  };


  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    console.log('creating ticket',numberString,cat)
    axios.post("http://localhost:5000/tickets/create_ticket",{disability: disabled,phone:numberString})
    .then((data:any)=> {
        setQrState(data.data)
        setClicked(false)
        setSuccess(true)
        setQr(true)
        setInterval(()=> {
            setSuccess(false)
            handleCapture()
            //handleConvertToImage()
            //convert1()
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

  const handleCapture = () => {
    const form:any = document.getElementById('myFrame');
    html2canvas(form).then((canvas) => {
      var a  = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
    //   a.download = 'image.png';
    //   a.click();
      setQr(false)
      printImage(a.href)
      //window.print()
      socket.emit("data",{data:{},route:"tickets"})
      router.reload()
    });
  };

  function printImage(src:any) {
    var win:any = window.open('about:blank', `${src}`);
    win.document.open();
    win.document.write([
        '<html>',
        '   <head>',
        '   </head>',
        '   <body onload="window.print()" onafterprint="window.close()" style="width: 100%; height: 50%; display: flex; align-items: center; justify-content: center; padding: 15px;">',
        '       <img src="' + src + '"/>',
        '   </body>',
        '</html>'
    ].join(''));
    win.document.close();
}

  return (
    <div className={styles.queue_add}>
        <div className={styles.top_notch}>
            {/* <div className={styles.item}>
                <div className={styles.logo}>
                    <img src="/mnh.png" alt="" />
                </div>
            </div> */}
            <div className={styles.title}>
                <h1>MUHIMBILI NATIONAL HOSPITAL MLOGANZILA</h1>
            </div>
        </div>
        {
         <div className={cx(styles.printable, isQr && styles.active)} style={{background:"white"}}>
                <form id='myFrame' ref={formRef}>
                    <h1>MNH MLOGANZILA</h1>
                    <div className={styles.contents}>
                    <h2>{qr.ticket_no}</h2>
                    <div className={styles.qr}><QRCode value={qrData} /></div>
                    <p>Karibu Hospitali ya Taifa Muhimbili Mloganzila</p>
                    </div>
                    <p className={styles.date}>{date.getDate().toString().padStart(2, '0') }/{month.toString().padStart(2, '0')}/{date.getUTCFullYear()}   <span>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span></p>
                </form>
            </div>
        }
        {
            clicked && (
                <div className={styles.overlay}>
                    <div className={cx(styles.content,clicked && styles.active)}>
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
                            <div className={styles.exceptions}>
                                <h1>Una Uhitaji Maalumu?</h1>
                                <div className={styles.suggestions}>
                                    {
                                        sags.map((item:any,indexa:number)=> (
                                         <div className={cx(styles.suggestion,item.id===index && styles.active)} onClick={()=> changeSag(item.id,item.name)} key={indexa}>#{item.name}</div>  
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={styles.action}>
                                <button onClick={submit} type='submit'>Submit</button>
                                {/* <button onClick={convert} type='submit'>Submit</button> */}
                                <div className={styles.cleara} onClick={()=> setClicked(false)}><MdClear className={styles.icona}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        {
            isSuccess && (
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <div className={styles.conts}>
                        <div className={styles.topa}><IoMdCheckmark size={40} className={styles.icon}/></div>
                        <h1>Success</h1>
                        </div>
                    </div>
                </div>
            )
        }
        {
            services.length>0 && (<div className={styles.items}>
                {
                    services.map((item:any,index:number)=> (
                        <div className={styles.item} key={index} onClick={()=> enterNumber(item.name)}>{item.name}</div>
                    ))
                }
            </div>)
        }
    </div>
  )
}
