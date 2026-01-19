import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import cx from "classnames";
import AdvertScroller from "@/components/adverts/advert";
import axios from "axios";
import { useRouter } from "next/router";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import currentConditionState from "@/store/atoms/current";
import LanguageState from "@/store/atoms/language";
import { BiCurrentLocation } from "react-icons/bi";
import { IoMdStopwatch } from "react-icons/io";
import { TfiDirectionAlt } from "react-icons/tfi";
import { FaArrowsAltH } from "react-icons/fa";
import { BsMicMute } from "react-icons/bs";
import { VscUnmute } from "react-icons/vsc";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import deviceState from "@/store/atoms/device";
import messageState from "@/store/atoms/message";

export default function CashierQueue() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  //const {data:queue,loading,error} = useFetchData("http://localhost:5005/tickets/getTickets")
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
  //const eventSource = new EventSource('http://localhost:5005/socket/display_tokens_stream');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(true)
  const device = useRecoilValue(deviceState)
  const [videos, setVideos] = useState([])
  const [isVideo, setVideo] = useState(false)
  const setMessage = useSetRecoilState(messageState)

  useEffect(() => {
    if(Object.keys(device).length > 0 && (device.clinics !== undefined && Object.keys(device.clinics).length > 0)){
      getTickets();
    }
    getAdverts();
    getActive();
    getVideos()
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
      setBlink(!blink);
      getActive();
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

    return () => {
      clearInterval(intervalId);
      clearInterval(timer)
    };
  }, [condition, blink, device]);

  const formatTime = (unit:string) => {
    return String(unit).padStart(2, '0')
  }

  const getVideos = () => {
    axios.get("http://localhost:5005/uploads/get_videos").then((data)=> {
    setVideos(data.data)
    }).catch((error)=> {
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

  const getActive = () => {
    axios
      .get(`http://localhost:5005/active/get_active`, { params: { page: "/nurse_station" } })
      .then((data) => {
        setActive(data.data.isActive);
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response && error.response.status === 400) {
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
      });
  };

  const getAdverts = () => {
    axios
      .get("http://localhost:5005/adverts/get_all_adverts")
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
  const getTickets = () => {
    setLoading(true);
    axios
      .get("http://localhost:5005/tickets/get_clinic_tokens", {
        params: { selected_clinic: "", clinics: device.clinics.map((item:any)=> item.clinic_code) },
      })
      .then((data) => {
        setTickets(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setMessage({...onmessage,title:error.message,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
      });
  };

  return (
    <div className={styles.index}>
      <div className={cx(styles.queue_wrap, active && styles.nota)}>
        <div className={cx(styles.top_bar, active && styles.none)}>
          <h1>
            {language === "English"
              ? "HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA"
              : "HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA"}
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
            <div className={styles.hudumiwa}>
            <div className={styles.wrap}>
            <div className={styles.tatatata}>
              <h1>Anae Hudumiwa</h1>
            </div>
            <div className={styles.sepera}>
            </div>
            {tickets.length > 0 ? (
              <div className={styles.round}>
                {tickets
                  .filter(
                    (item: { ticket: { serving: boolean } }) =>
                      item.ticket.serving
                  )
                  .map((item: any, index: number) => (
                    <div className={styles.sava}>
                      <div key={index} className={styles.logo}>
                        <img src="/mnh.png" alt="" />
                      </div>
                      <div className={styles.tokeni}>
                        <div className={styles.title}>Tokeni Namba</div>
                        <div className={styles.token}>
                        {item.ticket.ticket_no}
                        </div>
                      </div>
                      <div className={styles.waiting_time}>
                        <IoMdStopwatch className={styles.icon} size={50}/>
                        <span>
                        {`${formatTime(hours.toString())}:${formatTime(minutes.toString())}:${formatTime(seconds.toString())}`}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className={styles.round}></div>
            )}
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
          <div className={styles.ad}>
            {adverts.length > 0 && <AdvertScroller adverts={adverts} />}
          </div>
          <div className={styles.time}>MATANGAZO</div>
        </div>
      </div>
    </div>
  );
}
