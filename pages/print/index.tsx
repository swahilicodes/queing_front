import React, { useEffect, useRef, useState } from 'react'
import styles from './queue_add.module.scss'
import { MdClear, MdOutlineClear } from 'react-icons/md'
import QRCode from 'qrcode.react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import qrState from '@/store/atoms/qr'
import { IoMdCheckmark } from 'react-icons/io'
import cx from 'classnames'
import html2canvas from 'html2canvas'
import { TiChevronRight } from 'react-icons/ti'
import errorState from '@/store/atoms/error'
import LanguageState from '@/store/atoms/language'
import { IoArrowUndoOutline, IoCheckmarkDone, IoChevronDown } from 'react-icons/io5'
import Cubes from '@/components/loaders/cubes/cubes'
import messageState from '@/store/atoms/message'
import { TbWorld } from 'react-icons/tb'

export default function QueueAdd() {
  const [cat,setcat] = useState("")
  const [clicked,setClicked] = useState(false)
  const [isQr,setQr] = useState(false)
  const [category, setCategory] = useState("")
  const keys = [1,2,3,4,5,6,7,8,9,0];
  const [numberString, setNumberString] = useState('');
  const [qr,setQrState] = useRecoilState<any>(qrState)
  const [isSuccess, setSuccess] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null);
  const date = new Date(qr.createdAt);
  const month = date.getMonth()+1
 const qrData = `phone:${qr.phone},clinic:${qr.category}`
 const [disabled, setDisabled] = useState('')
 const [index,setIndex] = useState(0)
 const [subLoading, setSubLoading] = useState(false)
 const [error, setError] = useRecoilState(errorState)
 const [language, setLanguage] = useState("Swahili")
 const setMessage = useSetRecoilState(messageState)
 const [seleccted, setSelected] = useState({
    index: 0,
    reason: "",
    type: "",
 })

 useEffect(()=> {
    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      if (seleccted.index > 0 && seleccted.type !== "") {
        setTimeout(()=> {
            setSubLoading(true)
        axios.post("http://192.168.30.246:5005/suggestion/create_suggestion", {
          type: seleccted.type,
          reason: seleccted.reason
        }).then(() => {
          setSubLoading(false)
          setSelected({ index: 0, type: "", reason: "" })
          setError(language === "English" ? "Thank you for your Feedback" : "Asante kwa Maoni Yako")
          setTimeout(() => setError(""), 3000)
        }).catch((error) => {
          setSubLoading(false)
          console.log(error.response)
        })
        setTimeout(() => {
          setSubLoading(false)
          setSelected({...seleccted,index:0,type: ""})
        }, 3000)
        },2000)
      }
  
      document.addEventListener('contextmenu', handleContextMenu);
  
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
 },[language,seleccted.index, seleccted.type])
 const suggestions = [
    {
        swahili: "Nzuri",
        english: "Good",
        icon: "/good.webp"
    },
    {
        swahili: "Kawaida",
        english: "Normal",
        icon: "/normal.webp"
    },
    {
        swahili: "Mbaya",
        english: "Bad",
        icon: "/bad.png"
    },
 ]
 const [items, setItems] = useState([
    { id: 1, name: 'mzee', isActive: false },
    { id: 2, name: 'mjamzito', isActive: false },
    { id: 3, name: 'mlemavu', isActive: false },
  ]);
 


  const handleSubmit = (index:number, item:any) => {
    setSelected({...seleccted,index:index+1,type: language==="English"?item.english:item.swahili})
  };

  const handleCategory = (category:string) => {
    setCategory(category)
    setClicked(true)
  }

  const enterNumber = () => {
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
  const clear = () => {
    setNumberString("")
  };



  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://192.168.30.246:5005/tickets/create_ticket",{phone:numberString,category: category})
    .then((data)=> {
        setQrState(data.data)
        setClicked(false)
        setSuccess(true)
        setQr(true)
        setInterval(()=> {
            setSuccess(false)
            handleCapture()
        },5000)
    }).catch((error)=> {
        console.log(error.response)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
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
      router.reload()
    });
  };

function printImage(src: string) {
    var win:any = window.open('about:blank', '_blank');
    win.document.open();
    win.document.write([
        '<html>',
        '   <head>',
        '       <style>',
        '           @media print {',
        '               body, html {',
        '                   width: 100%;',
        '                   height: 20%;',
        '                   margin: 0;',
        '                   padding: 0;',
        '                   display: flex;',
        '                   align-items: center;',
        '                   justify-content: center;',
        '               }',
        '               img {',
        '                   width: 100%;',
        '                   max-width: 300px;', // Adjust width to match thermal printer
        '                   height: auto;',
        '                   object-fit: cover;', // Ensure the image fits properly
        '               }',
        '           }',
        '       </style>',
        '   </head>',
        '   <body onload="window.print()" onafterprint="window.close()">',
        '       <img src="' + src + '" alt="Printed Image" />',
        '   </body>',
        '</html>'
    ].join(''));
    win.document.close();
}

 const changeLanguage = () => {
    if(language==="Swahili"){
        setLanguage("English")
    }else{
        setLanguage('Swahili')
    }
 }


  return (
    <div className={styles.queue_add}>
        <div className={cx(styles.note_overlay,error && styles.display)}>
        <div className={cx(styles.note,error && styles.display)}>
            <p>{error}</p>
            <div className={styles.icon}>
             <IoCheckmarkDone className={styles.icon__}/>
            </div>
        </div>
        </div>
        <div className={styles.language}>
            <div className={styles.lang_icons} onClick={()=> changeLanguage()}>
                <TbWorld size={30} className={cx(styles.world,styles.icon__)}/>
                <p>{language==="Swahili"?"sw":"eng"}</p>
            </div>
        </div>
        <div className={styles.top_notch}>
            <div className={styles.logo}>
                <img src="/tz.png" alt="" />
            </div>
            <div className={styles.title}>
                <h1>{language==="English"?"The United Republic of Tanzania":"Jamhuri Ya Muungano wa Tanzania"}</h1>
                <h2>{language==="English"?"Muhimbili National Hospital - Mloganzila":"Hospitali ya Taifa Muhimbili - Mloganzila"}</h2>
            </div>
            <div className={styles.logo}>
                <img src="/mnh.png" alt="" />
            </div>
        </div>
        {
         <div className={cx(styles.printable, isQr && styles.active)} style={{background:"white"}}>
                <form id='myFrame' ref={formRef}>
                    <div className={styles.contents}>
                    <h2 style={{fontSize: "60px"}}>{qr.ticket_no}</h2>
                    <div className={styles.qr}><QRCode value={qrData} /></div>
                    {/* <p style={{fontWeight: "600", fontSize: "18px"}}>Karibu Hospitali ya Taifa Muhimbili Mloganzila</p> */}
                    </div>
                    <p style={{fontWeight: "600", fontSize: "12px"}} className={styles.date}>{date.getDate().toString().padStart(2, '0') }/{month.toString().padStart(2, '0')}/{date.getUTCFullYear()}   <span>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span></p>
                    <h6 style={{fontWeight: "600", fontSize: "15px", color:"blue"}}>www.mloganzila.or.tz</h6>
                </form>
            </div>
        }
        {
            clicked && (
                <div className={styles.overlay}>
                    <div className={cx(styles.content,clicked && styles.active)}>
                        <div className={styles.top}>
                            <h1>{language==="English"?"Enter Phone Number":"Ingiza Namba Ya Simu"}</h1>
                        </div>
                        <div className={styles.contents}>
                            <div className={styles.bar}>
                                {/* <div className={styles.left}>{numberString.trim()===''?0:numberString}</div> */}
                                <div className={styles.left}>
                                <input
                                  type="text"
                                  value={numberString}
                                  placeholder="0"
                                />
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.baa} onClick={()=> handleClearClick()}>
                                    <IoArrowUndoOutline className={styles.icon} size={30}/>
                                    </div>
                                    <div className={styles.baa} onClick={()=> clear()}>
                                    <MdOutlineClear className={styles.icon} size={30}/>
                                    </div>
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
                                <button onClick={submit} type='submit' className={styles.tapa}>
                                    <p>{language==="English"?"Submit":"Wasilisha"}</p>
                                </button>
                                <div className={styles.cleara} onClick={()=> setClicked(false)}><MdClear className={styles.icona} size={30}/></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        {
            isSuccess && (
                <div className={styles.overlay}>
                    <Cubes/>
                    {/* <div className={styles.content}>
                        <div className={styles.conts}>
                        <div className={styles.topa}><IoMdCheckmark size={40} className={styles.icon}/></div>
                        <h1>Success</h1>
                        </div>
                    </div> */}
                </div>
            )
        }
        <div className={styles.items}>
            {/* <div className={styles.item} onClick={()=> enterNumber()}> */}
            <div className={styles.item} onClick={()=> handleCategory("insurance")}>
                <p>{language==="English"?"Insurance":"Bima"}</p>
            </div>
            <div className={styles.item} onClick={()=> handleCategory("cash")}>
                <p>{language==="English"?"Cash":"Keshi"}</p>
            </div>
            <div className={styles.suggestions}>
                <div className={styles.title}>
                    <h3>{language==="English"?"How do you see our services?":"Unaonaje Huduma Zetu?"}</h3>
                </div>
                <div className={styles.sugs}>
                    {
                        suggestions.map((item,index:number)=> (
                            <div className={cx(styles.sug,seleccted.index===index+1 && styles.active)} key={index} onClick={()=> handleSubmit(index,item)}>
                                <div className={styles.imoji_content}>
                                <p>{language==="English"?item.english:item.swahili}</p>
                                <div className={styles.image_wrapper}>
                                 <img src={item.icon} alt="" />
                                </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                
            </div>
        </div>
    </div>
  )
}
