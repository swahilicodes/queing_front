import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import cx from "classnames";
import AdvertScroller from "@/components/adverts/advert";
import axios from "axios";
import { useRouter } from "next/router";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useRecoilState, useRecoilValue } from "recoil";
import currentConditionState from "@/store/atoms/current";
import LanguageState from "@/store/atoms/language";
import { BiCurrentLocation } from "react-icons/bi";
import { IoMdStopwatch } from "react-icons/io";
import { TfiDirectionAlt } from "react-icons/tfi";
import { FaArrowsAltH } from "react-icons/fa";
import { BsMicMute, BsStopwatch } from "react-icons/bs";
import { VscUnmute } from "react-icons/vsc";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { TiArrowRepeat } from "react-icons/ti";
import { TbHeartHandshake } from "react-icons/tb";
import Cubes from "@/components/loaders/cubes/cubes";
import deviceState from "@/store/atoms/device";

export default function Home() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  //const {data:queue,loading,error} = useFetchData("http://192.168.30.245:5000/tickets/getTickets")
  const [tickets, setTickets] = useState<any>([]);
  const [adverts, setAdverts] = useState([]);
  const router = useRouter();
  const [time, setTime] = useState(0);
  // const minutes = Math.floor(time / 60) % 60;
  // const hours = Math.floor(minutes / 60) % 3600;
  // const seconds = time % 60;
  const [condition, setCondition] = useRecoilState(currentConditionState);
  const [, setLoading] = useState(false);
  const [language] = useRecoilState(LanguageState);
  const [blink, setBlink] = useState(false);
  const [active, setActive] = useState(false);
  //const eventSource = new EventSource('http://192.168.30.245:5000/socket/display_tokens_stream');
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
  const device = useRecoilValue(deviceState)
  const [nextServe, setNextServe] = useState({
    id: 0,
    window: 0
  })

  useEffect(() => {
    if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
      getTickets();
    }
    getAdverts();
    getActive();
    getServing()
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
      setBlink(!blink);
      getActive();
      getServing()
    }, 1000);

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 59) {
          setMinutes((prevMinutes) => {
            if (prevMinutes === 59) {
              setHours((prevHours) => prevHours + 1);
              return 0;
            }
            return prevMinutes + 1;
          });
          return 0;
        }
        return prevSeconds + 1;
      });
    }, 1000);

    const restId = setInterval(() => {
      if(isRest){
        setRest(false)
      }else{
        setRest(true)
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timer);
      setTimeout(()=> {
        clearInterval(restId);
      },10000)
    };
  }, [condition, blink,token, serveId,isRest, language, device]);

  const getServing = () => {
    if(tickets.length > 0){
      const sava = tickets.find((item:any)=> item.ticket.serving===true)
      if(sava){
        setServing(sava)
        handleToken(sava.ticket.ticket_no,sava)
        const selectedIndex = tickets.findIndex((item:any) => item.id === sava.id);
        if(selectedIndex !== -1 && selectedIndex < tickets.length - 1){
          setNextServe({...nextServe,id:tickets[selectedIndex + 1].ticket.id,window: tickets[selectedIndex + 1].counter.namba})
        }
      }else{
        setServing({})
      }
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

  const getActive = () => {
    axios
      .get(`http://192.168.30.245:5000/active/get_active`, { params: { page: router.pathname } })
      .then((data) => {
        setActive(data.data.isActive);
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response && error.response.status === 400) {
          //console.log(`there is an error ${error.message}`);
          alert(error.response.data.error);
        } else {
          //console.log(`there is an error message ${error.message}`);
          alert(error.message);
        }
      });
  };

  const getAdverts = () => {
    axios
      .get("http://192.168.30.245:5000/adverts/get_all_adverts")
      .then((data) => {
        setAdverts(data.data);
      })
      .catch((error) => {
        alert(error);
      });
  };
  // const getTickets = () => {
  //   setLoading(true);
  //   axios
  //     .get("http://192.168.30.245:5000/tickets/get_clinic_tokens", {
  //       //params: { selected_clinic: "", clinics: device.clinics.map((item:any)=> item.clinic_code) },
  //       params: { selected_clinic: "", clinics: [201] },
  //     })
  //     .then((data) => {
  //       console.log('clinics are ',data)
  //       setTickets(data.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log('response is ',error.response)
  //       setLoading(false);
  //       alert(error);
  //     });
  // };
  const getTickets = () => {
    setLoading(true);
    axios
      .get("http://192.168.30.245:5000/tickets/pata_clinic", {
        params: { stage: "nurse_station", clinics: device.clinics.map((item:any)=> item.clinic_code) },
      })
      .then((data) => {
        setTickets(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
        console.log(error.response)
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
              <video src="/videos/mnh.mp4" autoPlay loop muted={muted} />
            </div>
          )}
            <div className={cx(styles.left_wrap,active && styles.none)}>
              {
                Object.keys(serving).length> 0 
                ? <div className={styles.servicer}>
                <div className={styles.title}>
                <h3>{language==="English"?"SERVING NOW":"ANAYE HUDUMIWA SASA"}</h3>
                </div>
                <div className={styles.namba}>
                  <h1>{serving.ticket.ticket_no}</h1>
                </div>
                <div className={styles.counter}>
                  <div className={styles.stop}>
                    <div className={styles.stopa_wrap}>
                    <BsStopwatch size={45} className={styles.stop_watch}/>
                    </div>
                  </div>
                  <div className={styles.stopa_time}>
                  {`${formatTime(hours.toString())}:${formatTime(minutes.toString())}:${formatTime(seconds.toString())}`}
                  </div>
                </div>
              </div>
                : <div className={styles.servicer}>
                  <div className={styles.video}>
                      <video src="/videos/stomach.mp4" autoPlay muted loop/>
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
                      <p>{nextServe.id}</p>
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
                <div className={styles.namba}>{language==="Swahili"?"DIRISHA":"WINDOW"}</div>
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
                        :<FaArrowsAltH
                        className={cx(styles.cona, blink && styles.blink)}
                        size={40}
                        />
                      }
                      </div>
                      <div className={styles.right}>
                      {item.counter === undefined
                              ? "000"
                              : item.counter.namba
                      }
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
          <div className={styles.time}>
            <div className={styles.timer}>{hour}:{minute} {amPm}</div>
            <div className={styles.date}>{day}/{month}/{year}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
