import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import cx from "classnames";
import AdvertScroller from "@/components/adverts/advert";
import axios from "axios";
import { useRouter } from "next/router";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import currentConditionState from "@/store/atoms/current";
import { FaArrowsAltH } from "react-icons/fa";
import { BsStopwatch } from "react-icons/bs";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { TbHeartHandshake } from "react-icons/tb";
import deviceState from "@/store/atoms/device";
import messageState from "@/store/atoms/message";
import CurrentServing from "@/components/current_serving/current_serving";
import CurrentTime from "@/components/current_time/current_time";
import { SlDirection } from "react-icons/sl";
import { RiDirectionLine } from "react-icons/ri";
import ClinicCounter from "@/components/display_clinic_counter/clinic_counter";

export default function Home() {
  const [tickets, setTickets] = useState<any>([]);
  const [adverts, setAdverts] = useState([]);
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [condition, setCondition] = useRecoilState(currentConditionState);
  const [, setLoading] = useState(false);
  const [language, setLanguage] = useState("Swahili");
  const [blink, setBlink] = useState(false);
  const [active, setActive] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [serveId, setServeId] = useState(0)
  const [muted, setMuted] = useState(true)
  const [token,setToken] = useState("")
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = now.getFullYear();
  const amPm = hours >= 12 ? "PM" : "AM";
  const [isRest, setRest] = useState<boolean>(true)
  const [serving, setServing] = useState<any>({})
  const [savs, setSavs] = useState<any>([])
  const device = useRecoilValue(deviceState)
  const setMessage = useSetRecoilState(messageState)
  const [video, setVideo] = useState("")
  const [doktas, setDoktas] = useState([])
  const [nextServe, setNextServe] = useState({
    id: 0,
    window: 0
  })
  const maneno = [
    {
      "english":"WELCOME TO",
      "swahili":"KARIBU"
    },
    {
      "english":"MLOGANZILA",
      "swahili":"MLOGANZILA"
    }
  ]
  const [currentText, setCurrentText] = useState(0)

  useEffect(()=> {
    getAdverts()
    if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
          getTickets();
    }
    const tickInterval = setInterval(()=> {
      if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
        getTickets();
        getAdverts()
      }
    },2000)
    return () => {
      clearInterval(tickInterval)
    }
  },[device])

  useEffect(()=> {
    const timeInterval = setInterval(()=> {
      if(language==="Swahili"){
        setLanguage("English")
      }else{
        setLanguage("Swahili")
      }
    },4000)

       const restId = setInterval(() => {
      if(isRest){
        setRest(false)
      }else{
        setRest(true)
      }
    }, 10000);
    return () => {
      clearInterval(timeInterval)
      clearInterval(restId)
    }
  },[language])

  useEffect(()=> {
    getActive();
    getDoktas()

    const restId = setInterval(()=> {
      getActive()
    },1000)
    return () => {
      clearInterval(restId)
    }
  },[])

  const displayRoom = (id:string) => {
    if(id==null){
      return "N/A"
    }else{
      const room:any = doktas.find((item:any)=> item.id == id)
      return room.room
    }
  }
  function getNextTicket(savs:any, tickets:any) {
    const maxId = Math.max(...savs.map((item:any) => item.ticket.id));
    const next = tickets.find((ticket:any) => ticket.ticket.id < maxId)
    if(next){
      return next.ticket.ticket_no
    }else{
      return "00"
    }
    //return  || null;
  }

  const getDoktas = () => {
    axios.get("http://localhost:5000/doktas/get_all_doktas").then((data)=> {
      setDoktas(data.data)
      console.log('doctors are ',data.data)
    }).catch((error)=> {
      console.log(error)
    })
  }
  

  // useEffect(() => {
  //   if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
  //     getTickets();
  //   }

  //   const ticksInterval = setInterval(()=> {
  //     if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
  //       getTickets();
  //       console.log(tickets.map((item:any)=> item.ticket.serving))
  //     }
  //   },1000)
  //   getAdverts();
  //   getActive();
  //   getServing()
  //   const intervalId = setInterval(() => {
  //     setTime((prevTime) => prevTime + 1);
  //     setBlink(!blink);
  //     getActive();
  //     getServing()
  //     if(currentText === 0){
  //       setCurrentText(1)
  //     }else{
  //       setCurrentText(0)
  //     }
  //   }, 1000);

  //   const timer = setInterval(() => {
  //     setSeconds((prevSeconds) => {
  //       if (prevSeconds === 59) {
  //         setMinutes((prevMinutes) => {
  //           if (prevMinutes === 59) {
  //             setHours((prevHours) => prevHours + 1);
  //             return 0;
  //           }
  //           return prevMinutes + 1;
  //         });
  //         return 0;
  //       }
  //       return prevSeconds + 1;
  //     });
  //   }, 1000);

  //   const restId = setInterval(() => {
  //     if(isRest){
  //       setRest(false)
  //     }else{
  //       setRest(true)
  //     }
  //   }, 10000);

  //   return () => {
  //     clearInterval(intervalId);
  //     clearInterval(timer);
  //     clearInterval(ticksInterval);
  //     setTimeout(()=> {
  //       clearInterval(restId);
  //     },10000)
  //   };
  // }, [condition, blink,token, serveId,isRest, language, device,tickets]);

  // useEffect(()=> {
  //   const langId = setInterval(() => {
  //     if(language==="Swahili"){
  //       setLanguage("English")
  //     }else{
  //       setLanguage("Swahili")
  //     }
  //   }, 5000);
  //   return () => {
  //     clearInterval(langId);
  //   };
  // },[language,tickets])

  // const getServing = () => {
  //   if(tickets.length > 0){
  //     const sava = tickets.find((item:any)=> item.ticket.serving===true)
  //     if(sava){
  //       setServing(sava)
  //       handleToken(sava.ticket.ticket_no,sava)
  //       const selectedIndex = tickets.findIndex((item:any) => item.id === sava.id);
  //       if(selectedIndex !== -1 && selectedIndex < tickets.length - 1){
  //         setNextServe({...nextServe,id:tickets[selectedIndex + 1].ticket.id,window: tickets[selectedIndex + 1].counter.namba})
  //       }
  //     }else{
  //       setServing({})
  //     }
  //   }
  // }

  function formatNumber(num: string) {
    const numStr = num.toString();
  
    if (numStr.length === 1) {
      return `00${numStr}`;
    } else if (numStr.length === 2) {
      return `0${numStr}`;
    } else {
      return numStr;
    }
  }

  const formatTime = (unit:string) => {
    return String(unit).padStart(2, '0')
  }

  const handleToken = (data:string,item:any) => {
    if(token !== data){
      setMinutes(0)
      setSeconds(0)
      setHours(0)
    }
    setToken(item.ticket.ticket_no)
    // setInterval(()=> {
    //   setMinutes(0)
    //   setSeconds(0)
    //   setHours(0)
    // },2000)
  }

  function getCurrentDay() {
    const days = [
      { english: "Sunday", swahili: "Jumapili" },
      { english: "Monday", swahili: "Jumatatu" },
      { english: "Tuesday", swahili: "Jumanne" },
      { english: "Wednesday", swahili: "Jumatano" },
      { english: "Thursday", swahili: "Alhamisi" },
      { english: "Friday", swahili: "Ijumaa" },
      { english: "Saturday", swahili: "Jumamosi" }
    ];

    const today = new Date();
    return days[today.getDay()];
  }

  const getActive = () => {
    axios
      .get(`http://localhost:5000/active/get_active`, { params: { page: "/clinic_queue" } })
      .then((data) => {
        //setActive(data.data.isActive && localStorage.getItem('device_id')?true:false);
        setActive(data.data.isActive?true:false);
        setVideo(data.data.video)
      })
      .catch((error) => {
        //console.log(error.response);
        // if (error.response && error.response.status === 400) {
        //   setMessage({...onmessage,title:error.response.data.error,category: "error"})
        // } else {
        //   setMessage({...onmessage,title:error.message,category: "error"})
        // }
      });
  };

  const getAdverts = () => {
    axios
      .get("http://localhost:5000/adverts/get_all_adverts")
      .then((data) => {
        setAdverts(data.data);
      })
      .catch((error) => {
        setMessage({...onmessage,title:error.message,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
      });
  };

  const getTickets = async () => {
    setLoading(true);
    await axios
      .get("http://localhost:5000/tickets/pata_clinic", {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: { 
          stage: "nurse_station", 
          clinics: device.clinics.map((item:any)=> item.clinic_code),
          ts: Date.now()
        },
      })
      .then((data) => {
        setLoading(false);
        setTickets([...data.data]);
        const sava = data.data.filter((item:any)=> item.ticket.serving===true)
        setSavs(sava)
      })
      .catch((error) => {
        setLoading(false);
        setMessage({...onmessage,title:error.message,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
        setMessage({...onmessage,title:error.message,category: "error"})
      });
  };

  return (
    <div className={styles.index}>
      <div className={cx(styles.queue_wrap, active && styles.nota)}>
        <div className={cx(styles.top_bar, active && styles.none)}>
          <h1>
            {language === "Swahili"
              ? "HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA"
              : "MUHIMBILI NATIONAL HOSPITAL - MLOGANZILA"}
          </h1>
        </div>
        <div className={styles.new_look}>
          <div className={styles.new_left}>
          {active && (
            <div className={styles.vid}>
              <div className={styles.mute} onClick={()=> setMuted(!muted)}>
                {
                  muted
                  ? <CiMicrophoneOn className={styles.icon} size={40}/>
                  : <CiMicrophoneOff className={styles.icon} size={40}/>
                }
              </div>
              <video src={video} autoPlay loop muted={muted} />
            </div>
          )}
            <div className={cx(styles.left_wrap,active && styles.none)}>
              {
                savs.length > 0 
                ? <div className={styles.servicer}>
                <div className={styles.title}>
                <h3>{language==="English"?"SERVING NOW":"ANAYE HUDUMIWA SASA"}</h3>
                </div>
                <div className={styles.namba}>
                  <CurrentServing savs={savs}/>
                </div>
                <div className={styles.counter}>
                <CurrentTime savs={tickets.filter((item: any) => item.ticket.serving === true)}/>
                  {/* <div className={styles.stop}>
                    <div className={styles.stopa_wrap}>
                    <BsStopwatch size={45} className={styles.stop_watch}/>
                    </div>
                  </div>
                  <div className={styles.stopa_time}>
                  {`${formatTime(hours.toString())}:${formatTime(minutes.toString())}:${formatTime(seconds.toString())}`}
                  </div> */}
                </div>
              </div>
                : <div className={styles.servicer}>
                  <div className={styles.jina}>
                    <h1 className={cx(styles.h1)}>
                    {
                      language==="English"? maneno[currentText].english:maneno[currentText].swahili
                    }
                    </h1>
                  </div>
                </div>
              }
              <div className={styles.nexting}>
                <div className={cx(styles.nextang,isRest && styles.rest)}>
                  {
                    !isRest
                    ? <div className={styles.video}>
                      <video src="/videos/stomach.mp4" autoPlay muted loop/>
                    </div>
                    : <div className={styles.tiketi}>
                      {/* <p>{formatNumber(nextServe.id.toString())}</p> */}
                      <p>{getNextTicket(savs,tickets)}</p>
                      <TbHeartHandshake className={styles.icon} size={50}/>
                      <p>{nextServe.window}</p>
                    </div>
                  }
                </div>
                <div className={cx(styles.signage,isRest && styles.rest)}>
                  <div className={cx(styles.wrapper_sig,isRest && styles.rest)}>
                    {
                      isRest
                      ? <p>{language==="English"?"NEXT":"ANAYE FUATA"}</p>
                      : <div className={styles.indicators}>
                        <div className={`${styles.divAnimation} ${styles.divDelay1}`}></div>
                        <div className={`${styles.divAnimation} ${styles.divDelay2}`}></div>
                        <div className={`${styles.divAnimation} ${styles.divDelay3}`}></div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            <div className={styles.nexta}>
              <div className={styles.tita}>
                <div className={styles.title}>Anae Fata</div>
              </div>
              <div className={styles.nexta_content}>
                {
                  tickets.length > 1 && (
                    <div className={styles.row}>
                      <div className={styles.token}>{tickets[1].ticket.ticket_no}</div>
                      <FaArrowTrendUp className={styles.icon} size={40}/>
                      <div className={styles.tokena}>{tickets[1].counter.namba}</div>
                    </div>
                  )
                }
              </div>
            </div>
            </div>
          </div>
          <div className={styles.new_right}>
            {
              tickets.length > 0 
              ? <div className={styles.new_queue}>
              <div className={styles.top}>
                <div className={styles.namba}>{language==="Swahili"?"TIKETI":"TICKET"}</div>
                <div className={styles.window}>
                  <div className={styles.window_item}>
                  {language==="Swahili"?"DIRISHA":"WINDOW"}
                  </div>
                  <div className={styles.window_item}>
                  {language==="Swahili"?"CHUMBA":"ROOM"}
                  </div>
                </div>
              </div>
              <div className={styles.body}>
                {
                  tickets.map((item:any,index:number)=> (
                    <div className={cx(styles.item,item.ticket.disabled===true && styles.disabled)} key={index} onLoad={()=> setServeId(index+1)}>
                      <div className={cx(styles.absa,item.ticket.serving===true && styles.serving, (nextServe.id !==0 && nextServe.id===Number(item.ticket.id)) && styles.next)} onLoad={()=> handleToken(item.ticket.ticket_no,item)}>{index+1}</div>
                      <div className={styles.left}>
                      <p>{item.ticket.ticket_no}</p>
                      </div>
                      <div className={styles.middle}>
                      {
                        item.ticket.serving===false
                        ? <FaArrowTrendUp className={styles.con} size={40} />
                        : <FaArrowTrendUp className={styles.cona} size={40}/>
                        // :<FaArrowsAltH
                        // className={cx(styles.cona, blink && styles.blink)}
                        // size={40}
                        // />
                      }
                      </div>
                      <div className={styles.right}>
                        <div className={styles.right_item}>
                          <ClinicCounter/>
                        {/* {item.ticket.counter === undefined
                                ? <ClinicCounter/>
                                : item.ticket.counter
                        } */}
                        </div>
                        <div className={styles.right_item}>
                        <RiDirectionLine className={cx(styles.con,displayRoom(item.ticket.doctor_id) !=="N/A" && styles.active)} size={40}/>
                        </div>
                        <div className={styles.right_item}>
                        <div className={styles.room}>{displayRoom(item.ticket.doctor_id)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className={styles.color_description}>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "red" }}
                    ></div>
                    <p>{language==="English"?"SPECIAL NEEDS":"UHITAJI"}</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#34E734" }}
                    ></div>
                    <p>{language==="English"?"SERVING":"ANAYE HUDUMIWA"}</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#FFFF00" }}
                    ></div>
                    <p>{language==="English"?"NEXT":"ANAYE FUATA"}</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#FF5D00" }}
                    ></div>
                    <p>{language==="English"?"TOKEN":"TOKENI"}</p>
                  </div>
                </div>
            </div>
              : <div className={styles.loader}>
                {
                  Array.from({length: 10}).map((_,index:number)=> (
                    <div className={styles.div}>
                      <div className={styles.shimmer}></div>
                    </div>
                  ))
                }
              </div>
            }
            {tickets.length > 0 ? (
              <div className={styles.queue_div}>
                {tickets.map(
                  (
                    item: {
                      ticket: {
                        disability: string;
                        serving: boolean,
                        ticket_no:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<React.AwaitedReactNode>
                          | null
                          | undefined;
                      };
                      counter:
                        | {
                            namba:
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | Promise<React.AwaitedReactNode>
                              | null
                              | undefined;
                          }
                        | undefined;
                    },
                    index: number
                  ) => (
                    <div
                      className={cx(
                        styles.div,
                        item.ticket.disability !== "" && styles.serving
                      )}
                      key={index}
                    >
                      <div
                        className={cx(
                          styles.indi,
                          item.ticket.serving  && styles.serving,
                          index === 1 && styles.next
                        )}
                      >
                        {" "}
                        <p>{index + 1}</p>{" "}
                      </div>
                      <div className={styles.ticket_info}>
                        <p>{item.ticket.ticket_no}</p>
                        {item.ticket.serving ? (
                          <FaArrowsAltH
                          className={cx(styles.cona, blink && styles.blink)}
                          size={40}
                          />
                          // <div className={styles.indicator}>
                          //   <BiCurrentLocation
                          //     className={cx(styles.con, blink && styles.blink)}
                          //     size={40}
                          //   />
                          // </div>
                        ) : (
                          <FaArrowTrendUp className={styles.con} size={40} />
                        )}
                        <span>
                          {language === "English" ? "Dirisha" : "Dirisha"}{" "}
                          <span>
                            {item.counter === undefined
                              ? "000"
                              : item.counter.namba}
                          </span>{" "}
                        </span>
                      </div>
                    </div>
                  )
                )}
                <div className={styles.color_description}>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "red" }}
                    ></div>
                    <p>Uhitaji</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#34E734" }}
                    ></div>
                    <p>Anae Hudumiwa</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#FFFF00" }}
                    ></div>
                    <p>Anae Fata</p>
                  </div>
                  <div className={styles.color_item}>
                    <div
                      className={styles.item}
                      style={{ backgroundColor: "#FF5D00" }}
                    ></div>
                    <p>Tokeni</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.queue_div}>
                {Array.from({ length: 10 }).map((item, index) => (
                  <div className={styles.shimmer_top} key={index}>
                    <div className={styles.shimmer}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.ads}>
          <div className={styles.logo}>
            <div className={styles.wrapper}>
            <img src="/loga.png" alt="" />
            <div className={styles.line}></div>
            </div>
          </div>
          <div className={styles.ad}>
            {adverts.length > 0 && <AdvertScroller adverts={adverts} />}
          </div>
          {/* <div className={styles.time}>MATANGAZO</div> */}
          {/* <div className={styles.time}>
            <div className={styles.timer}>{hour}:{minute} {amPm}</div>
            <div className={styles.date}>{day}/{month}/{year}</div>
          </div> */}
          <div className={styles.time}>
            <div className={styles.timer}>{hour}:{minute} {amPm}</div>
            <div className={styles.date}>{language == "English" ? getCurrentDay().english : getCurrentDay().swahili} <div className={cx(styles.break, language == "Swahili" && styles.swahili)}></div> {day}/{month}/{year}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
