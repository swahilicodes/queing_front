import React, { useEffect, useRef, useState } from "react";
import styles from "./recorder.module.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import currentUserState from "@/store/atoms/currentUser";
import cx from "classnames";
import { MdClear } from "react-icons/md";
import { IoArrowRedoOutline, IoSearch } from "react-icons/io5";
import Ticket_Category_Length from "@/components/ticket_category_length/ticket_category_length";
import currentConditionState from "@/store/atoms/current";
import axios from "axios";
import Cubes from "@/components/loaders/cubes/cubes";
import { useRouter } from "next/router";
import TimeAgo from "@/components/time";
import AudioTest from "@/components/audio_player/audio_test/audio";
import { GrPowerShutdown } from "react-icons/gr";
import SequentialAudio from "@/components/audio_player/sequential/sequential";
import isSpeakerState from "@/store/atoms/isSpeaker";
import GptPlayer from "@/components/audio_player/gpt/gpt";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import useCreateItem from "@/custom_hooks/useCreateItem";
import messageState from "@/store/atoms/message";
import isUserState from "@/store/atoms/isUser";

function Recorder() {
  const currentUser: User = useRecoilValue(currentUserState);
  const [status, setStatus] = useState("waiting");
  const [search, setSearch] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page,] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [, setTotalItems] = useState(0);
  const [disable,] = useRecoilState(currentConditionState);
  const [ticket, setTicket] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const [next, setNext] = useState(false)
  const [mr_number, setMrNumber] = useState("")
  const [found, setFound] = useState(false)
  const router = useRouter()
  const [penalized, setPenalized] = useState(false)
  const [, setExpired] = useState<Token[]>([]);
  const [active, setActive] = useState(false)
  const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
  const {createItem,loading} = useCreateItem()
  const setMessage = useSetRecoilState(messageState)
  const [isPrior, setPrior] = useState(false)
  const [videos, setVideos] = useState([])
  const [activeVideo, setActiveVideo] = useState("")
  const [isVideo, setVideo] = useState(false)
  const setUser = useSetRecoilState(isUserState)
  const [insurance, setInsurance] = useState(5)
  const [isInsurance,setIsinsurance] = useState(false)
  const [fields, setFields] = useState({
    finish_id: "",
    patName: "",
    sex: "",
    category: "",
    age: ""
  })
  const reasons = ["Staff","Wheel Chair","Pediatric","Old","Premature","Fast Track", "Pregnancy"]
  const [reason, setReason] = useState("")
  const [priorFields, setPriorFields] = useState({
    ticket_no: '',
    stage: ''
  })
  

  useEffect(() => {
    getTicks();
    getActive()
    getRest()
    getVideos()
  }, [status, disable, ticket, active]);

  const createRest = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/rest/create_rest",{time:insurance}).then((data)=> {
      location.reload()
    }).catch((error)=> {
      console.log("rest error ",error)
    })
  }
  const getRest = () => {
    console.log('getting rest')
    axios.get("http://localhost:5000/rest/get_rest").then((data)=> {
      setInsurance(data.data.time)
      console.log('rest data is ',data.data.time)
    }).catch((error)=> {
      console.log("rest error ",error)
    })
  }

  const getVideos = () => {
    axios.get("http://localhost:5000/uploads/get_videos").then((data)=> {
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

  const prepareFinish = (id:number) => {
    setNext(true)
    setFields({...fields,finish_id: id.toString()})
  }
  

  const finishToken = (id:number,stage:string,mr_number:string,sex:string, recorder_id: string,name:string, age: string, category: string) => {
    if(found){
      setFinLoading(true)
    axios.put(`http://localhost:5000/tickets/finish_token/${id}`,{stage:"accounts",mr_number: mr_number,penalized: penalized,sex:sex, recorder_id: recorder_id, name:name, age: age, category: category}).then(()=> {
      setInterval(()=> {
        setFinLoading(false)
        router.reload()
      },3000)
    }).catch((error)=> {
      setFinLoading(false)
      console.log('accounts error ',error.response)
      if (error.response && error.response.status === 400) {
        //console.log(`there is an error ${error.message}`)
        setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
    } else {
        //console.log(`there is an error message ${error.message}`)
        setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
    }
    })
    }else{
      setMessage({...onmessage,title:'Patient not found',category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
    }
  }


  const getTicks = () => {
    setFetchLoading(true);
    axios.get("http://localhost:5000/tickets/getMedsTickets", {
        params: { page, pagesize, status, disable, phone: ticket, stage: "meds" },
      })
      .then((data) => {
        setTokens(data.data.data);
        setTotalItems(data.data.totalItems);
        setExpired(data.data.data)
        setInterval(() => {
          setFetchLoading(false);
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };

  const preparePnF = () => {
    setPenalized(true)
    setNext(true)
  }
  const editTicket = (id:number, status: string) => {
    setFetchLoading(true);
    axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`, {status: status})
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };

  const penalize = (id:number) => {
    setFetchLoading(true);
    axios.put(`http://localhost:5000/tickets/penalt/${id}`)
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const priotize = (ticket_no:string, data:string, stage: string, reason:string,counter:number) => {
    setFetchLoading(true);
    axios.get(`http://localhost:5000/tickets/priority`,{params: {ticket_no,data,stage, reason,counter},headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const activate = (page:string,video:string) => {
    setFetchLoading(true);
    axios.post(`http://localhost:5000/active/activate`,{page: page,video:video})
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          //console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          //console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const getActive = () => {
    axios.get(`http://localhost:5000/active/get_active`,{params: {page: "/"}})
      .then((data) => {
        setActive(data.data.isActive)
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          //console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          //console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const nextToken = (e: React.FormEvent) => {
    e.preventDefault()
    setFinLoading(true);
    axios.get("http://localhost:5000/tickets/next_stage", {
        params: { mr_number: mr_number },
      })
      .then((data) => {
        setFound(true)
        setFields({...fields,patName:data.data.fullName.toUpperCase(),sex: data.data.gender, age: data.data.age,category: data.data.patgName})
        setFinLoading(false);
        console.log(fields)
      })
      .catch((error) => {
        setFinLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const signOut = () => {
    localStorage.removeItem('token')
    router.reload()
  }

  const priorReady = (ticket_no:string, stage: string) => {
    setPrior(true)
    setPriorFields({...priorFields,ticket_no: ticket_no, stage: stage})
  }
  return (
    <div className={styles.recorder}>
     <div className={styles.insurance} onClick={()=> setIsinsurance(true)}>
      <p>{insurance}</p>
     </div>
     {
      isInsurance && (
        <div className={styles.overlay01}>
          <div className={styles.insurance_content}>
            <div className={styles.close} onClick={()=> setIsinsurance(false)}>close</div>
            <div className={styles.title}>Insurance Wait Time</div>
            <form onSubmit={createRest}>
              <select
              value={insurance}
              onChange={e => setInsurance(Number(e.target.value))}
              >
                <option value="" selected disabled>--select--</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )
     }
      {
        isVideo && (
          <div className={styles.overlay01}>
            <div className={styles.contents}>
              <div className={styles.close} onClick={()=> setVideo(false)}>close</div>
              {
                videos.length > 0 && (
                  <div className={styles.video_list}>
                    <div className={styles.title}>
                      <h1>Display Videos</h1>
                    </div>
                    {
                      videos.map((item:any,index:number)=> (
                        <div className={styles.video_item} key={index}>
                          <p>{item.name}</p>
                          <div className={styles.video}>
                            <video src={item.url}/>
                          </div>
                          <div className={styles.action} onClick={()=> activate("/",item.url)}>set</div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
        )
      }
      {
        isPrior && (
          <div className={styles.priority}>
            <div className={styles.prior_data}>
              <div className={styles.title}>Select Reason</div>
              <select onChange={e => setReason(e.target.value)}>
                <option value="" selected disabled>--select--</option>
                {
                  reasons.map((item,index)=> (
                    <option value={item} key={index}>{item}</option>
                  ))
                }
              </select>
              <button onClick={()=> priotize(`${priorFields.ticket_no}`,"priority",priorFields.stage, reason,Number(currentUser.counter))}>Prioritize</button>
            </div>
          </div>
        )
      }
      <div className={styles.meds_top}>
        <div className={styles.left}>
          {currentUser.name !== undefined && <h4>{currentUser.name}| <span>{currentUser.role} | {currentUser.counter}</span> </h4> }
          {
            currentUser.name !== undefined && (
              <div className={styles.out} onClick={signOut}>
            <GrPowerShutdown/>
          </div>
            )
          }
           <div className={styles.rest} onClick={()=> setVideo(true)}>
           {/* <div className={styles.rest} onClick={()=> activate("/")}> */}
            {!active?"rest":"activate"}
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={cx(styles.search, search && styles.active)}
            // onClick={() => setSearch(!search)}
          >
            {search ? (
              <div className={styles.search_bar}>
                <input 
                type="text" 
                value={ticket}
                onChange={e => setTicket(e.target.value)}
                placeholder="Phone Number"
                />
              </div>
            ) : (
              <div className={styles.icon}></div>
            )}
            {
                  search
                  ?<MdClear className={styles.icon__}onClick={() => setSearch(!search)} size={40}/>
                  :<IoSearch className={styles.icon__}onClick={() => setSearch(!search)} size={40}/>
                }
          </div>
          <div className={styles.side}>
            <label>Status:</label>
            <select onChange={(e) => setStatus(e.target.value)} value={status}>
              <option value="waiting">waiting</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
              <option value="pending">pending</option>
            </select>
          </div>
          <div className={styles.side}>
            <div className={styles.image} style={{width:"40px",height:"40px",borderRadius:"50%",cursor:"pointer"}} onClick={()=> setUser(true)}>
              <img src="/place_holder.png" alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.overlay, next && styles.active)}>
        <div className={styles.next_stage}>
            <div className={styles.close} onClick={()=> setNext(false)}>close</div>
            <form>
                <input 
                type="text"
                placeholder="Mr Number" 
                value={mr_number}
                onChange={e => setMrNumber(e.target.value.toUpperCase())}
                />
                {
                    !fields.patName
                    ? <p>Patient: -----</p>
                    : <p>Patient: <span>{fields.patName}</span></p>
                }
                <div className={styles.buttons}>
                <div onClick={nextToken} className={styles.button}>Search</div>
                <div onClick={()=> found && finishToken(Number(fields.finish_id),"accounts",mr_number,fields.sex, currentUser.phone,fields.patName,fields.age, fields.category)} className={cx(styles.button,styles.finish, found && styles.found)}>Finish</div>
                </div>
            </form>
            <div className={cx(styles.fin_loader,finLoading && styles.active)}>
                <div className={styles.progress}></div>
            </div>
        </div>
      </div>
      <div className={styles.list}>
        {fetchLoading ? (
          <div className={styles.loader}>
            <Cubes />
          </div>
        ) : (
          <div className={styles.list_items}>
            {tokens.length > 0 ? (
              <div className={styles.wrap}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Token</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>CreatedAt</th>
                      <th>Challenge</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((item:Token, index: number) => (
                      <tr key={index} className={cx(index%2 === 0 && styles.even)}>
                        <td>{index+1}</td>
                        <td>{item.token.ticket_no}</td>
                        <td>{item.token.phone}</td>
                        <td>{item.token.status}</td>
                        <td><TimeAgo isoDate={new Date(item.token.createdAt).toISOString()} /></td>
                        <td>{item.token.disability===""?"N/A":item.token.disability}</td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.action}>
                              <div className={cx(styles.serve,item.token.serving && styles.active, (item.token.serving && item.token.serving_id === currentUser.phone) && styles.owner)} onClick={()=> priotize(`${item.token.ticket_no}`,"serve",item.token.stage, "sasas",Number(currentUser.counter))}>{item.token.serving===true?"serving":"Serve"}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve,item.token.disabled && styles.prioritya)} onClick={()=> priorReady(`${item.token.ticket_no}`,item.token.stage)}>{item.token.disabled?"prioritized":"prioritize"}</div>
                              {/* <div className={cx(styles.serve,item.token.disabled && styles.priority)} onClick={()=> priotize(`${item.token.ticket_no}`,"priority",item.token.stage)}>{item.token.disabled?"prioritized":"prioritize"}</div> */}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.wrap}>
                <div className={styles.no_data}>There are no <span>{status}</span> patients</div>
              </div>
            )}
          </div>
        )}
      </div>
      {
        tokens.filter((item)=> item.token.serving===true && item.token.serving_id=== currentUser.phone && item.token.status===status).map((item:Token,index:number)=> (
          <div
        className={cx(
          styles.serving,
          tokens.length > 0 && !fetchLoading && styles.active
        )}
      >
        <div className={styles.speaker}>
        {
            tokens.length > 0 && (
              <div className={cx(styles.spika,loading && styles.active)} onClick={()=> setSpeaker(!isSpeaker)}>
                <div className={styles.rounder} onClick={()=> createItem(item.token.ticket_no.toString(),"meds","m02","http://localhost:5000/speaker/create_speaker",currentUser.counter)}>
                  {
                    !loading
                    ? <HiOutlineSpeakerWave className={styles.icon} size={30}/>
                    : <HiOutlineSpeakerXMark className={styles.icon} size={30}/>
                  }
                </div>
                {/* <GptPlayer token={542} counter={4}/> */}
                {/* <SequentialAudio token={`1005`} counter={`${item.counter===undefined?"1":item.counter.namba}`} stage={item.token.stage} isButton={true} talking={isSpeaker}/> */}
              </div>
            )
            // tokens.length > 0 && (<SequentialAudioPlayer  token={`${item.token.ticket_no}`} counter={`${item.counter===undefined?"1":item.counter.namba}`}/>)
        }
        </div>
        <div className={styles.row}>
          <div className={styles.row_item} onClick={()=> editTicket(item.token.id, status==="pending"?"waiting":"pending")}>
            <div className={styles.button}>{status==="pending"?"Unpend":"Pend"}</div>
          </div>
          {/* <div className={styles.row_item} onClick={nextToken}> */}
          <div className={styles.row_item}>
            <div className={styles.token}>{tokens.length> 0 && item.token.ticket_no}</div>
          </div>
          <div className={styles.row_item} onClick={()=> prepareFinish(item.token.id)}>
            <div className={styles.button}>Finish</div>
          </div>
          {/* <div className={styles.row_item} onClick={()=> penalize(item.token.id)}>
            <div className={styles.button}>Penalize</div>
          </div>
          <div className={styles.row_item} onClick={()=> preparePnF()}>
            <div className={styles.button}>Finish & Penalize</div>
          </div> */}
        </div>
      </div>
        ))
      }
      {tokens.length > 0 && (
        <div className={styles.chini}>
          <div className={styles.top}>
            <div className={styles.item}>
              <p>On Queue: <span> <Ticket_Category_Length category="meds" status='waiting'/> </span> </p>
            </div>
            <div className={styles.item}>
              <p>Pending: <span><Ticket_Category_Length category="meds" status='pending'/></span> </p>
            </div>
            <div className={styles.item}>
              <p>Cancelled: <span><Ticket_Category_Length category="meds" status='cancelled'/></span> </p>
            </div>
            <div className={styles.item_out}>
              <IoArrowRedoOutline className={styles.icon} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recorder;
