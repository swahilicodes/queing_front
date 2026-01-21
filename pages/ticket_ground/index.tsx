import React, { useEffect, useRef, useState } from 'react'
import styles from './ticket.module.scss'
import cx from 'classnames'
import { useRecoilState, useSetRecoilState } from 'recoil'
import messageState from '@/store/atoms/message'
import { MdClear, MdOutlineClear } from 'react-icons/md'
import axios from 'axios'
import qrState from '@/store/atoms/qr'
import html2canvas from 'html2canvas'
import Cubes from '@/components/loaders/cubes/cubes'
import QRCode from 'qrcode.react'
import errorState from '@/store/atoms/error'
import { IoCheckmarkDone } from 'react-icons/io5'
import { TbWorld } from 'react-icons/tb'
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaWheelchair } from 'react-icons/fa'

function TicketGround() {
  const [language, setLanguage] = useState("Swahili")
  const setMessage = useSetRecoilState(messageState)
  const [qr,setQrState] = useRecoilState<any>(qrState)
  const [isSuccess, setSuccess] = useState(false)
  const [clicked,setClicked] = useState(false)
  const [isQr,setQr] = useState(false)
  const formRef = useRef<HTMLFormElement>(null);
  const qrData = `phone:${qr.phone},clinic:${qr.category}`
  const date = new Date(qr.createdAt);
  const month = date.getMonth()+1
  const [fields, setFields] = useState({
      isBima: false,
      isCash: false,
      isNHIF: false,
      isOther: false,
      hasMedical: false,
      dontHaveMedical: false,
      isMrTime: false,
      isPhoneTime: false,
      isM: true,
      isA: false,
      numberString: '',
      isLoading: false,
      isPriority: false,
      isPriorCode: false,
      priorToken: "",
      priorCode: "",
      priorLoading: false,
      // NEW diabetic flags
      isDiabetic: false,
      isNotDiabetic: false,
      isChild: false,
      isNotChild: false
  })
  const numbers = [1,2,3,4,5,6,7,8,9,11,0,12]
  const [subLoading, setSubLoading] = useState(false)
  const [error, setError] = useRecoilState(errorState)
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

   const handleSubmit = (index:number, item:any) => {
      setSelected({...seleccted,index:index+1,type: language==="English"?item.english:item.swahili})
    };

  const handleClose = () => {
      // reset relevant fields (including diabetic flags)
      setFields({...fields,isBima: false, isCash: false, isNHIF:false, isOther:false, hasMedical:false, dontHaveMedical:false, isMrTime:false, isDiabetic:false, isNotDiabetic:false})
      location.reload()
  }

   const handleNumberClick = (num:number) => {
      setFields({...fields,numberString: fields.numberString+num})
    };

   const handleTokenClick = (num:number) => {
      if(num==12){
       setFields({...fields,isPriority: false}) 
       location.reload()  
      }else{
          setFields({...fields,priorToken: fields.priorToken+num})
      }
    };
   const handleCodeClick = (num:number) => {
      if(num==12){
      setFields({...fields,isPriorCode: false,isPriority:false})
      location.reload()
      }else{
        setFields({...fields,priorCode: fields.priorCode+num})  
      }
    };

    const handleClearClick = () => {
      if (fields.numberString.length > 0) {
       setFields({...fields,numberString: fields.numberString.slice(0,-1)})
      }
    };

    const handleClearToken = () => {
      if (fields.priorToken.length > 0) {
       setFields({...fields,priorToken: fields.priorToken.slice(0,-1)})
      }
    };
    const handleClearCode = () => {
      if (fields.priorCode.length > 0) {
       setFields({...fields,priorCode: fields.priorCode.slice(0,-1)})
      }
    };
    const clear = () => {
      setFields({...fields,numberString: ""})
    };

    const handlePriotize = (priorToken:string,priorCode:string) => {
      //setFields({...fields,priorLoading: true})
      setFields({...fields,isPriorCode: true,priorToken: priorToken,priorCode: priorCode,priorLoading: true})
      axios.post("http://192.168.30.246:5005/ticketa/priotize",{ticket_no:priorToken,code:priorCode}).then((data)=> {
          setTimeout(()=> {
              setFields({...fields,priorLoading: false,isPriority:false,isPriorCode:false})
              location.reload()
          },3000)
      }).catch((error)=> {
          setTimeout(()=> {
              setFields({...fields,priorLoading: false})
          },3000)
          if(error.status===500){
              setMessage({...onmessage,title:error.message,category:"error"}) 
              setTimeout(()=> {
              setMessage({...onmessage,title:"",category:""})
              },3000)
          }else{
              setMessage({...onmessage,title:error.response.data.error,category:"error"})
              setTimeout(()=> {
              setMessage({...onmessage,title:"",category:""})
              },3000)
          }
      })
    }

    const handleClearClickAll = (item:number) => {
      if(item===11){
          clear()
      }else if(item===12){
          if(fields.isPriority){
              setFields({...fields,isPriority: false})
              location.reload()
          }else{
              setFields({...fields,isMrTime: false})
          }
          //location.reload()
      }else{
          handleNumberClick(item)
      }
    }
  const handleMrTime = (haveMedical:boolean) => {
      if(fields.isBima && (fields.isNHIF===false && fields.isOther===false)){
          setMessage({...onmessage,title:language==="Swahili"?"Tafadhali Chagua Aina ya Bima":"Choose Insurance Type",category:"error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category:""})  
          },3000)
      }else{
          // when proceeding to MR flow, reset diabetic flags (they will be set in the next step)
          setFields({...fields,isMrTime: true,hasMedical:haveMedical?true:false,dontHaveMedical:haveMedical?false:true, isDiabetic:false, isNotDiabetic:false})
      }
  }

  function formatCode(isA:boolean, isM:boolean, numStr:string) {
    // Strip non-digits just in case
    const digits = numStr.replace(/\D/g, '');

    if (isM) {
      // Extract up to 6 digits in groups of 2
      const mParts = [];
      for (let i = 0; i < 6 && i < digits.length; i += 2) {
        const part = digits.slice(i, i + 2);
        if (part) mParts.push(part.padStart(2, '0'));
      }
      const result = 'M' + mParts.join('-');
      return result.slice(0, 9).toUpperCase(); // Ensure no more than 9 chars
    }

    if (isA) {
      const aDigits = digits.slice(0, 6); // Max 6 digits after 'A'
      return 'A' + aDigits.toUpperCase();
    }

    return ''.toUpperCase(); // If neither flag is true
  }

  const submit = (e:React.FormEvent) => {
      e.preventDefault()
      setFields({...fields,isLoading:true})
      if(fields.numberString === ""){
          setMessage({...onmessage,title:"Phone Or Mr Number Required",category:"error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category:""})
            setFields({...fields,isLoading:false})  
          },3000)
      }else{
          axios.post("http://192.168.30.246:5005/ticketa/create_ticket",{
          //phone: fields.hasMedical?formatCode(fields.isA,fields.isM,fields.numberString):fields.numberString,
          phone: fields.numberString,
          category: fields.isBima===true?"insurance":"cash",
          hasMedical: fields.hasMedical,
          isNHIF: fields.isNHIF,
          floor: "ground",
          isDiabetic: fields.isDiabetic, // <-- send diabetic flag
          isChild: fields.isChild // <-- send diabetic flag
      }).then((data)=> {
          setQrState(data.data)
          //setClicked(false)
          setSuccess(true)
          setQr(true)
          setTimeout(()=> {
            setFields({...fields,isMrTime:false})
            setFields({...fields,isLoading:false}) 
            setSuccess(false)
            handleCapture()
          },5000)
      }).catch((error)=>{
          console.log(error)
          setMessage({...onmessage,title: error.response.data.error,category:"error"})
          setTimeout(()=> {
            setMessage({...onmessage,title: "",category:""})  
          },3000)
      }).finally(()=> {
          setFields({...fields,isLoading:false}) 
      })
      }
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
        location.reload()
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
          '                   height: 30%;',
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
    <div className={styles.ticket}>
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
        <div className={styles.priority}>
            <div className={styles.lang_icons} onClick={()=> setFields({...fields,isPriority: true})}>
                <FaWheelchair size={30} className={cx(styles.world,styles.icon__)}/>
            </div>
        </div>
      <div className={styles.ticket_top}>
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
        <div className={styles.center}>
            <div className={styles.item} onClick={()=> setFields({...fields,isBima: true,isCash: false, isDiabetic:false, isNotDiabetic:false})}>
                <p>{language==="Swahili"?"Bima":"Insurance"}</p>
            </div>
            <div className={styles.item} onClick={()=> setFields({...fields,isCash: true,isBima: false, isDiabetic:false, isNotDiabetic:false})}>
                <p>{language==="Swahili"?"Taslimu/Msamaha":"Cash"}</p>
            </div>
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
        <div className={cx(styles.printable, isQr && styles.active)} style={{background:"white"}}>
            <form id='myFrame' ref={formRef} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <h2 style={{fontSize: "40px",color:"black",fontWeight:"600"}}>Tiketi</h2>
                <div className={styles.contents}>
                <h2 style={{fontSize: "60px"}}>{qr.ticket_no}</h2>
                <div className={styles.qr}><QRCode value={qrData} /></div>
                {/* <p style={{fontWeight: "600", fontSize: "18px"}}>Karibu Hospitali ya Taifa Muhimbili Mloganzila</p> */}
                </div>
                <p style={{fontWeight: "600", fontSize: "12px"}} className={styles.date}>{date.getDate().toString().padStart(2, '0') }/{month.toString().padStart(2, '0')}/{date.getUTCFullYear()}   <span>{date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}</span></p>
                <h6 style={{fontWeight: "600", fontSize: "15px", color:"blue"}}>www.mloganzila.or.tz</h6>
            </form>
        </div>
        {
            /* ---------- Bima Flow (insurance) ---------- */
            (fields.isBima===true && fields.isMrTime===false) && (
                <div className={styles.isBima}>
                    <div className={styles.general_decision}>
                        <div className={styles.close} onClick={()=> handleClose()}>close</div>
                        <div className={styles.bima_choices}>
                          <div className={cx(styles.choice,fields.isNHIF===true && styles.active)} onClick={()=> setFields({...fields,isNHIF: true,isOther: false})}>NHIF</div>
                          <div className={cx(styles.choice,fields.isOther===true && styles.active)} onClick={()=> setFields({...fields,isOther: true,isNHIF: false})}>{language==="Swahili"?"Zingine":"Other"}</div>
                        </div>

                      {
                        (fields.isNHIF || fields.isOther) && (
                          <div className={styles.decision}>
                              <div className={styles.title}>
                                  <p>{language==="Swahili"?"Una Namba Ya Matibabu?":"Have Medical Records Number!"}</p>
                              </div>
                              <div className={styles.bima_choices}>
                                <div className={cx(styles.choice,fields.hasMedical===true && styles.active)} onClick={()=> setFields({...fields,hasMedical:true,dontHaveMedical:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                                <div className={cx(styles.choice,fields.dontHaveMedical===true && styles.active)} onClick={()=> setFields({...fields,hasMedical:false,dontHaveMedical:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                              </div>

                              {/* Diabetic question (shows after MR choice) */}
                              {
                                (fields.hasMedical || fields.dontHaveMedical) && (
                                  <div className={styles.decision}>
                                    <div className={styles.title}>
                                      <p>{language==="Swahili"?"Je, unaenda kliniki ya kisukari?":"Heading to Diabetic Clinic?"}</p>
                                    </div>
                                    <div className={styles.bima_choices}>
                                      <div className={cx(styles.choice,fields.isDiabetic===true && styles.active)} onClick={()=> setFields({...fields,isDiabetic:true,isNotDiabetic:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                                      <div className={cx(styles.choice,fields.isNotDiabetic===true && styles.active)} onClick={()=> setFields({...fields,isDiabetic:false,isNotDiabetic:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                                    </div>
                                  </div>
                                )
                              }
                              {
                                (fields.isDiabetic || fields.isNotDiabetic) && (
                                  <div className={styles.decision}>
                                    <div className={styles.title}>
                                      <p>{language==="Swahili"?"Je, umemleta Mtoto?":"Did you bring a child?"}</p>
                                    </div>
                                    <div className={styles.bima_choices}>
                                      <div className={cx(styles.choice,fields.isChild===true && styles.active)} onClick={()=> setFields({...fields,isChild:true,isNotChild:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                                      <div className={cx(styles.choice,fields.isNotChild===true && styles.active)} onClick={()=> setFields({...fields,isChild:false,isNotChild:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                                    </div>
                                  </div>
                                )
                              }

                              {/* Continue button to go to number input */}
                              {
                                (fields.isChild || fields.isNotChild) && (
                                  <div style={{marginTop: 12}}>
                                    <button className={styles.submit_btn} onClick={()=> setFields({...fields,isMrTime:true})}>
                                      {language==="Swahili"?"Endelea":"Continue"}
                                    </button>
                                  </div>
                                )
                              }

                          </div>
                        )
                      }

                    </div>
                </div>
            )
        }

        {
            /* ---------- Cash Flow (shows similar MR + diabetic question) ---------- */
            (fields.isCash===true && fields.isMrTime===false) && (
                <div className={styles.isBima}>
                    <div className={styles.general_decision}>
                        <div className={styles.close} onClick={()=> handleClose()}>close</div>
                        <div className={styles.decision}>
                            <div className={styles.title}>
                                <p>{language==="Swahili"?"Una Namba Ya Matibabu?":"Have Medical Records Number!"}</p>
                            </div>
                            <div className={styles.bima_choices}>
                            <div className={cx(styles.choice,fields.hasMedical===true && styles.active)} onClick={()=> setFields({...fields,hasMedical:true,dontHaveMedical:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                            <div className={cx(styles.choice,fields.dontHaveMedical===true && styles.active)} onClick={()=> setFields({...fields,hasMedical:false,dontHaveMedical:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                        </div>

                        {/* Diabetic question (for cash flow) */}
                        {
                          (fields.hasMedical || fields.dontHaveMedical) && (
                            <div className={styles.decision}>
                              <div className={styles.title}>
                                <p>{language==="Swahili"?"Unaenda Kliniki ya kisukari?":"Heading to diabetic clinic?"}</p>
                              </div>
                              <div className={styles.bima_choices}>
                                <div className={cx(styles.choice,fields.isDiabetic===true && styles.active)} onClick={()=> setFields({...fields,isDiabetic:true,isNotDiabetic:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                                <div className={cx(styles.choice,fields.isNotDiabetic===true && styles.active)} onClick={()=> setFields({...fields,isDiabetic:false,isNotDiabetic:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                              </div>
                            </div>
                          )
                        }
                        {
                                (fields.isDiabetic || fields.isNotDiabetic) && (
                                  <div className={styles.decision}>
                                    <div className={styles.title}>
                                      <p>{language==="Swahili"?"Je, umemleta Mtoto?":"Did you bring a child?"}</p>
                                    </div>
                                    <div className={styles.bima_choices}>
                                      <div className={cx(styles.choice,fields.isChild===true && styles.active)} onClick={()=> setFields({...fields,isChild:true,isNotChild:false})}>{language==="Swahili"?"Ndiyo":"Yes"}</div>
                                      <div className={cx(styles.choice,fields.isNotChild===true && styles.active)} onClick={()=> setFields({...fields,isChild:false,isNotChild:true})}>{language==="Swahili"?"Hapana":"No"}</div>
                                    </div>
                                  </div>
                                )
                              }
                        {/* Continue button */}
                        {
                          (fields.isChild || fields.isNotChild) && (
                            <div style={{marginTop: 12}}>
                              <button className={styles.submit_btn} onClick={()=> setFields({...fields,isMrTime:true})}>
                                {language==="Swahili"?"Endelea":"Continue"}
                              </button>
                            </div>
                          )
                        }

                        </div>
                    {/* <button onClick={handleMrTime}>{language==="Swahili"?"Wasilisha":"Submit"}</button> */}
                    </div>
                </div>
            )
        }

        {
            fields.isMrTime && (
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <div className={styles.key_board}>
                            <div className={styles.title}>{language==="Swahili"?"Ingiza Namba Ya Simu/0755XXXXXX":"Enter Phone/0755XXXXXX"}</div>
                            <div className={styles.key_top}>
                              {/* <div className={cx(styles.m_a,fields.dontHaveMedical && styles.none)}>
                                <div className={cx(styles.m,fields.isM===true && styles.active)} onClick={()=> setFields({...fields,isM:true,isA:false})}>M</div>
                                <div className={cx(styles.a,fields.isA===true && styles.active)} onClick={()=> setFields({...fields,isM:false,isA:true})}>A</div>
                              </div> */}
                              <div className={styles.number_string}>
                                <input
                                  type="text"
                                  value={fields.numberString}
                                  placeholder="0"
                                />
                                {/* {fields.dontHaveMedical
                                ?<input
                                  type="text"
                                  value={fields.numberString}
                                  placeholder="0"
                                />
                                :formatCode(fields.isA,fields.isM,fields.numberString)} */}
                              </div>
                              <div className={styles.delete_number} onClick={handleClearClick}>
                                <MdOutlineClear className={styles.icon__} size={30}/>
                              </div>  
                            </div>
                            <div className={styles.key_numbers}>
                                {
                                    numbers.map((item,index:number)=> (
                                        <div className={cx(styles.key_number,item===11 && styles.fubaa,item===12 && styles.none)} onClick={()=> handleClearClickAll(item)} key={index}>{item===11?language==="Swahili"?"Futa":"Clear":item===12?language==="Swahili"?"Nyuma":"Back":item}</div>
                                    ))
                                }
                            </div>
                            <button onClick={submit} disabled={fields.priorLoading} className={cx(fields.priorLoading && styles.active)}>{language==="Swahili"?"Wasilisha":"Submit"}</button>
                        </div>
                        {
                            fields.isLoading && (<div className={styles.loader}>
                            <div className={styles.inside}></div>
                        </div>)
                        }
                    </div>
                </div>
            )
        }
        {
            isSuccess && (
                <div className={styles.overlay}>
                    <Cubes/>
                </div>
            )
        }
        {
            fields.isPriority && (
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <div className={styles.key_board}>
                            <div className={styles.title}>{language==="Swahili"?fields.isPriorCode?"Ingiza Code":"Ingiza Tokeni":fields.isPriorCode?"Enter Code":"Enter Token"}</div>
                            <div className={styles.key_top}>
                              {/* <div className={cx(styles.m_a,fields.dontHaveMedical && styles.none)}>
                                <div className={cx(styles.m,fields.isM===true && styles.active)} onClick={()=> setFields({...fields,isM:true,isA:false})}>M</div>
                                <div className={cx(styles.a,fields.isA===true && styles.active)} onClick={()=> setFields({...fields,isM:false,isA:true})}>A</div>
                              </div> */}
                              <div className={styles.number_string}>
                                <input
                                  type="text"
                                  value={fields.priorToken}
                                  placeholder="0"
                                />
                                {/* {fields.dontHaveMedical
                                ?<input
                                  type="text"
                                  value={fields.numberString}
                                  placeholder="0"
                                />
                                :formatCode(fields.isA,fields.isM,fields.numberString)} */}
                              </div>
                              <div className={styles.delete_number} onClick={handleClearToken}>
                                <MdOutlineClear className={styles.icon__} size={30}/>
                              </div>  
                            </div>
                            <div className={styles.key_numbers}>
                                {
                                    numbers.map((item,index:number)=> (
                                        <div className={cx(styles.key_number,item===11 && styles.fubaa,item===12 && styles.none)} onClick={()=> handleTokenClick(item)} key={index}>{item===11?language==="Swahili"?"Futa":"Clear":item===12?language==="Swahili"?"Nyuma":"Back":item}</div>
                                    ))
                                }
                            </div>
                            <button onClick={()=> setFields({...fields,isPriority:false,isPriorCode:true})} disabled={fields.isLoading} className={cx(fields.isLoading && styles.active)}>{language==="Swahili"?"Thibitisha":"Verify"}</button>
                            {/* <button onClick={()=>handlePriotize(fields.numberString,fields.numberString)} disabled={fields.isLoading} className={cx(fields.isLoading && styles.active)}>{language==="Swahili"?"Wasilisha":"Submit"}</button> */}
                        </div>
                        {
                            fields.isLoading && (<div className={styles.loader}>
                            <div className={styles.inside}></div>
                        </div>)
                        }
                    </div>
                </div>
            )
        }
        {
            fields.isPriorCode && (
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <div className={styles.key_board}>
                            <div className={styles.title}>{language==="Swahili"?fields.isPriorCode?"Ingiza Code":"Ingiza Tokeni":fields.isPriorCode?"Enter Code":"Enter Token"}</div>
                            <div className={styles.key_top}>
                              <div className={styles.number_string}>
                                <input
                                  type="text"
                                  value={fields.priorCode}
                                  placeholder="0"
                                />
                              </div>
                              <div className={styles.delete_number} onClick={handleClearCode}>
                                <MdOutlineClear className={styles.icon__} size={30}/>
                              </div>  
                            </div>
                            <div className={styles.key_numbers}>
                                {
                                    numbers.map((item,index:number)=> (
                                        <div className={cx(styles.key_number,item===11 && styles.fubaa,item===12 && styles.none)} onClick={()=> handleCodeClick(item)} key={index}>{item===11?language==="Swahili"?"Futa":"Clear":item===12?language==="Swahili"?"Nyuma":"Back":item}</div>
                                    ))
                                }
                            </div>
                            {/* <button onClick={()=> setFields({...fields,isPriority:false,isPriorCode:true})} disabled={fields.isLoading} className={cx(fields.isLoading && styles.active)}>{language==="Swahili"?"Thibitisha":"Verify"}</button> */}
                            <button onClick={()=>handlePriotize(fields.priorToken,fields.priorCode)} disabled={fields.isLoading} className={cx(fields.isLoading && styles.active)}>{language==="Swahili"?"Wasilisha":"Submit"}</button>
                        </div>
                        {
                            fields.priorLoading && (<div className={styles.loader}>
                            <div className={styles.inside}></div>
                        </div>)
                        }
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default TicketGround
