import React, {useEffect, useRef, useState } from "react";
import styles from "./accounts.module.scss";
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
import useCreateItem from "@/custom_hooks/useCreateItem";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import messageState from "@/store/atoms/message";
import isUserState from "@/store/atoms/isUser";
import AllTickets from "@/components/all_tickets/all_tickets";
import SearchableSelect from "@/components/searchable_clinics";

function Recorder() {
  const currentUser = useRecoilValue(currentUserState);
  const [status, setStatus] = useState("waiting");
  const [floor, setFloor] = useState("first");
  const [diabetic, setDiabetic] = useState("false");
  const [isChild, setChild] = useState("false");
  const [window, setWindow] = useState("1");
  const [search, setSearch] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [, setTotalItems] = useState(0);
  const [disable, setDisable] = useRecoilState(currentConditionState);
  const [ticket, setTicket] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const [next, setNext] = useState(false)
  const [found, setFound] = useState(false)
  const router = useRouter()
  const [penalized, setPenalized] = useState(false)
  const [active, setActive] = useState(false)
  const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
  const {createItem,loading} = useCreateItem()
  const setMessage = useSetRecoilState(messageState)
  const [activeVideo, setActiveVideo] = useState("")
  const [isVideo, setVideo] = useState(false)
  const [videos, setVideos] = useState([])
  const [isUser, setUser] = useRecoilState(isUserState)
  const [isPrior, setPrior] = useState(false)
  const reasons = ["Staff","Wheel Chair","Pediatric","Old","Premature","Fast Track", "Pregnancy"]
  const [reason, setReason] = useState("")
  const items = ["Apple", "Banana", "Orange", "Mango", "Pineapple"];
  const [selected, setSelected] = useState("");
  const [isClinic, setIsClinic] = useState(false)
  const [fields, setFields] = useState({
    mrNumber: "",
    status: "",
    isNew: false,
    isOld: false,
    finish_id: "",
    patName: "",
    sex: "",
    category: "",
    age: "",
    calling_token: ""
  })
  const [priorFields, setPriorFields] = useState({
      ticket_no: '',
      stage: ''
    })
  

  useEffect(() => {
    getTicks();
    getActive()
    getVideos()
    setInterval(()=> {
      setTokens((item)=> item.map((itema)=> itema))
    },1000)
  }, [status,disable, ticket,active,floor,diabetic]);

  useEffect(()=> {
      if(typeof window !== undefined){
        setStatus(localStorage.getItem("status")!)
        setFloor(localStorage.getItem("floor")!)
        setDiabetic(localStorage.getItem("diabetic")!)
        setChild(localStorage.getItem("isChild")!)
        setWindow(localStorage.getItem("window")!)
        console.log(localStorage.getItem("status"))
      }
    },[status])

  const handleNext = (token: any) => {
    setNext(true)
    setFields({...fields,mrNumber: token.mr_no})
  }

  const priorReady = (ticket_no:string, stage: string) => {
    setPrior(true)
    setPriorFields({...priorFields,ticket_no: ticket_no, stage: stage})
  }

  const toMeds = (id:number) => {
    axios.post("http://localhost:5005/ticketa/to_meds",{id}).then((data)=> {
      location.reload()
    }).catch((error)=> {
      setMessage({...onmessage,title:"There is an error",category:"error"})
      setTimeout(()=> {
        setMessage({...onmessage,title:"",category:""})
      },3000)
    })
  }

  const finishToken = (id:number,stage:string,mr_number:string,sex:string, recorder_id: string,name:string, age: string, category: string) => {  
    if(found){
        setFinLoading(true)
      axios.put(`http://localhost:5005/tickets/finish_account_token/${id}`,{stage:"nurse_station",mr_number: mr_number,penalized: penalized,sex:sex, recorder_id: recorder_id, name:name, age: age, category: category}).then((data)=> {
        clinicGo(data.data.mr_no)
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

     const nextToken = (e: React.FormEvent) => {
        e.preventDefault()
        setFinLoading(true);
        axios.get("http://localhost:5005/tickets/next_stage", {
            params: { mr_number: fields.mrNumber },
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

  const activate = (page:string,video:string) => {
    setFetchLoading(true);
    axios.post(`http://localhost:5005/active/activate`,{page: page,video:video})
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

  const handleStatus = (stata:string) => {
    const status = localStorage.getItem("status")
    if(status){
      localStorage.removeItem("status")
      localStorage.setItem("status",stata)
      location.reload()
    }else{
      localStorage.setItem("status",stata)
      location.reload()
    }
  }

  const handleFloor = (stata:string) => {
    const floor = localStorage.getItem("floor")
    if(floor){
      localStorage.removeItem("floor")
      localStorage.setItem("floor",stata)
      location.reload()
    }else{
      localStorage.setItem("floor",stata)
      location.reload()
    }
  }
  const handleChild = (stata:string) => {
    const floor = localStorage.getItem("isChild")
    if(floor){
      localStorage.removeItem("isChild")
      localStorage.setItem("isChild",stata)
      location.reload()
    }else{
      localStorage.setItem("isChild",stata)
      location.reload()
    }
  }
  const handleDiabetic = (stata:string) => {
    const diabetic = localStorage.getItem("floor")
    if(diabetic){
      localStorage.removeItem("diabetic")
      localStorage.setItem("diabetic",stata)
      setDiabetic(stata)
      location.reload()
    }else{
      localStorage.setItem("diabetic",stata)
      setDiabetic(stata)
      location.reload()
    }
  }
  const handleWindow = (stata:string) => {
    const diabetic = localStorage.getItem("window")
    if(diabetic){
      localStorage.removeItem("window")
      localStorage.setItem("window",stata)
      setWindow(stata)
      location.reload()
    }else{
      localStorage.setItem("window",stata)
      setWindow(stata)
      location.reload()
    }
  }

  const clinicGo = (mr_no:string) => {
    setFinLoading(true)
    axios.post(`http://localhost:5005/tickets/clinic_go`,{stage:"nurse_station",mr_number: mr_no,cashier_id: currentUser.phone}).then((data)=> {
      setFields({...fields,status:data.data})
      setTokens((tokens)=> tokens.map((item)=> item))
      setFinLoading(false)
      setInterval(()=> {
        router.reload()
      },2000)
    }).catch((error)=> {
      if(error.response && error.response.status === 400){
        setTokens((tokens)=> tokens.map((item)=> item))
        setInterval(()=> {
          setFinLoading(false)
          router.reload()
        },2000)
      }else{
        setFinLoading(false)
        setMessage({...onmessage,title:error.message,category: "error"})
      }
    })
  }


  const getTicks = () => {
    setFetchLoading(true);
    axios.get("http://localhost:5005/tickets/getMedsTickets", {
        params: { page, pagesize, status: status, disable, phone: ticket, stage: "accounts",floor: floor,isDiabetic: diabetic,isChild: isChild},
      })
      .then((data: any) => {
        setTokens(data.data.data);
        setTotalItems(data.data.totalItems);
        setInterval(() => {
          setFetchLoading(false);
        }, 2000);
      })
      .catch((error: any) => {
        setFetchLoading(false);
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

  const preparePnF = () => {
    setPenalized(true)
    setNext(true)
    console.log('penalized ',penalized)
  }
  const editTicket = (id:number, status: string) => {
    setFetchLoading(true);
    axios.put(`http://localhost:5005/tickets/edit_ticket/${id}`, {status: status})
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
          setMessage({...onmessage,title:error.message,category: "error"})
        }
      });
  };
  const penalize = (id:number) => {
    setFetchLoading(true);
    axios.put(`http://localhost:5005/tickets/penalt/${id}`)
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
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
        }
      });
  };
  const getActive = () => {
    axios.get(`http://localhost:5005/active/get_active`,{params: {page: "/accounts_queue"}})
      .then((data) => {
        setActive(data.data.isActive)
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          //console.log(`there is an error ${error.message}`);
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
          //console.log(`there is an error message ${error.message}`);
          setMessage({...onmessage,title:error.message,category: "error"})
        }
      });
  };
  const signOut = () => {
    localStorage.removeItem('token')
    router.reload()
  }

  const priotize = (ticket_no:string, data:string, stage: string, reason:string,counter:number) => {
    setFetchLoading(true);
    axios.get(`http://localhost:5005/tickets/priority`,{params: {ticket_no,data,stage, reason,counter},headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
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
  const serveTicket = (ticket_no:string, data:string,counter: number) => {
    setFetchLoading(true);
    axios.get(`http://localhost:5005/tickets/priority`,{params: {ticket_no,data, stage: "accounts",counter:counter},headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(() => {
        setInterval(() => {
          setFetchLoading(false);
          router.reload()
        }, 2000);
      })
      .catch((error) => {
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
        } else {
          setMessage({...onmessage,title:error.message,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
        }
      });
  };

  const PrepareNexta = (item:any) => {
    if(item.mr_no == null){
      setFields({...fields,isNew: true,isOld: false,finish_id: item.id})
    }else{
      setFields({...fields,isOld: true,isNew: false,finish_id: item.id,mrNumber: item.mr_no})
    }
  }

  const prepareCall = (token:string,stage:string,station:string,url:string,counter:string,phone:string) => {
    setFields({...fields,calling_token: token})
    createItem(token,stage,station,url,counter,phone)
  }
  return (
    <div className={styles.recorder}>
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
                          <div className={styles.action} onClick={()=> activate("/accounts_queue",item.url)}>set</div>
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
        isClinic && (
          <div className={styles.overlay01}>
            <div className={styles.contents}>
              <div className={styles.close} onClick={()=> setIsClinic(false)}>close</div>
              <div className={styles.search_list}>
              <h1>Change Clinic</h1>
              <SearchableSelect options={items} onSelect={setSelected} />
            </div>
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
      <div className={cx(styles.overlaya,next && styles.active)}>
        <div className={styles.data}></div>
      </div>
      <div className={styles.meds_top}>
        <div className={styles.left}>
        {currentUser.name !== undefined && <h4>{currentUser.name}|<span>{currentUser.role}</span>|<span>{currentUser.counter===undefined?currentUser.room:currentUser.counter}</span> </h4> 
          }
          {
            currentUser.name !== undefined && (
              <div className={styles.out} onClick={signOut}>
            <GrPowerShutdown/>
          </div>
            )
          }
          <div className={styles.rest} onClick={()=> setVideo(true)}>
          {/* <div className={styles.rest} onClick={()=> activate("/accounts_queue",act)}> */}
            {!active?"rest":"activate"}
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={cx(styles.search, search && styles.active)}
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
          {
            <div className={styles.side}>
            <label>Select Window:</label>
            <select onChange={(e) => handleWindow(e.target.value)} 
            value={window}
            >
              <option value="" selected disabled>--select window--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          }
          {
            floor==="ground" && (<div className={styles.side}>
            <label>isDiabetic:</label>
            <select onChange={(e) => handleDiabetic(e.target.value)} 
            value={diabetic}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>)
          }
          {
            <div className={styles.side}>
            <label>isChild:</label>
            <select onChange={(e) => handleChild(e.target.value)} 
            value={isChild}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          }
          <div className={styles.side}>
            <label>Floor:</label>
            <select onChange={(e) => handleFloor(e.target.value)} 
            value={floor}
            >
              <option value="first">First</option>
              <option value="ground">Ground</option>
            </select>
          </div>
          <div className={styles.side}>
            <label>Status:</label>
            <select onChange={(e) => handleStatus(e.target.value)} 
            value={status}
            >
              <option value="waiting">waiting</option>
              <option value="pending">pending</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className={styles.side}>
            <div className={styles.image} style={{width:"40px",height:"40px",borderRadius:"50%",cursor:"pointer"}} onClick={()=> setUser(true)}>
              <img src="/place_holder.png" alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.overlay, fields.isOld && styles.active)}>
        <div className={styles.next_stage}>
            {/* <div className={styles.close} onClick={()=> setNext(false)}>close</div> */}
            <div className={styles.close} onClick={()=> setFields({...fields,isOld: false})}>close</div>
            <form>
                <div className={styles.status}>Status: <span className={cx(fields.status==="Not Paid"?styles.red:styles.green)}>{fields.status ===""?"N/A": fields.status}</span></div>
                <div className={styles.buttons}>
                <div className={styles.button} onClick={()=> clinicGo(fields.mrNumber)}>Check Status</div>
                {/* <div onClick={()=> submit(tokens[0].token.id,bill)} className={styles.button}>Check Status</div> */}
                {/* <div onClick={()=> found && finishToken(tokens[0].token.id,"accounts",mr_number)} className={cx(styles.button,styles.finish, found && styles.found)}>Finish</div> */}
                </div>
            </form>
            <div className={cx(styles.fin_loader,finLoading && styles.active)}>
                <div className={styles.progress}></div>
            </div>
        </div>
      </div>
      <div className={cx(styles.overlay, fields.isNew && styles.active)}>
        <div className={styles.next_stage}>
            <div className={styles.close} onClick={()=> setFields({...fields,isNew: false})}>close</div>
            <form>
                <input 
                type="text"
                placeholder="Mr Number" 
                value={fields.mrNumber}
                onChange={e => setFields({...fields,mrNumber:e.target.value.toUpperCase()})}
                />
                {
                    !fields.patName
                    ? <p>Patient: -----</p>
                    : <p>Patient: <span>{fields.patName}</span></p>
                }
                <div className={styles.buttons}>
                <div onClick={nextToken} className={styles.button}>Search</div>
                <div onClick={()=> found && finishToken(Number(fields.finish_id),"nurse_station",fields.mrNumber,fields.sex, currentUser.phone,fields.patName,fields.age, fields.category)} className={cx(styles.button,styles.finish, found && styles.found)}>Finish</div>
                </div>
            </form>
            <div className={cx(styles.fin_loader,finLoading && styles.active)}>
                <div className={styles.progress}></div>
            </div>
        </div>
      </div>
      <div className={styles.list}>
        {fetchLoading  ? (
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
                      <th>Token</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Mr-Number</th>
                      <th>Gender</th>
                      <th>Status</th>
                      {
                        status ==="all" && (
                          <th>Stage</th>
                        )
                        }
                      <th>Medical Time</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((item:Token, index: number) => (
                      <tr key={index} className={cx(index%2 === 0 && styles.even)}>
                        <td>{item.token.ticket_no}</td>
                        <td>{item.token.name}</td>
                        <td>{item.token.age}</td>
                        <td>{item.token.mr_no}</td>
                        <td>{item.token.gender}</td>
                        <td>{item.token.status}</td>
                        {
                        status ==="all" && (
                          <td>{item.token.stage}</td>
                        )
                        }
                        <td><TimeAgo isoDate={new Date(item.token.med_time).toISOString()} /></td>
                        <td>{item.token.category===null?"N/A":item.token.category}</td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.action}>
                              <div className={cx(styles.serve,(loading && fields.calling_token===item.token.ticket_no.toString()) && styles.calling)} onClick={()=> prepareCall(item.token.ticket_no.toString(),"meds",floor,"http://localhost:5005/speaker/create_speaker",window,currentUser.phone)}>{loading && fields.calling_token===item.token.ticket_no.toString()?"calling..":"call"}/{item.token.calls===null?0:item.token.calls}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve,item.token.serving && styles.active)} onClick={()=> serveTicket(`${item.token.ticket_no}`,"serve",Number(currentUser.counter))}>{item.token.serving===true?"serving":"Serve"}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve)} onClick={()=> editTicket(item.token.id,status==="waiting"?"pending":"waiting")}>{status==="waiting"?"pend":"unpend"}</div>
                            </div>
                            <div className={styles.action}>
                                <div className={cx(styles.serve,item.token.disabled && styles.prioritya)} onClick={()=> priorReady(`${item.token.ticket_no}`,item.token.stage)}>{item.token.disabled?"prioritized":"prioritize"}</div>
                              </div>
                            <div className={styles.action}>
                                <div className={cx(styles.serve)} onClick={()=> toMeds(item.token.id)}>Meds</div>
                              </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve)} onClick={()=> PrepareNexta(item.token)}>Finish</div>
                            </div>
                            {
                              status == "all" && (
                                <div className={styles.action}>
                              <div className={cx(styles.serve)} onClick={()=> setIsClinic(true)}>Clinic</div>
                            </div>
                              )
                            }
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
        tokens.filter((item)=> item.token.serving===true && item.token.serving_id=== currentUser.phone).slice(0,1).map((item:Token,index:number)=> (
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
                <div className={styles.rounder} onClick={()=> createItem(item.token.ticket_no.toString(),"accounts",floor,"http://localhost:5005/speaker/create_speaker",window,currentUser.phone)}>
                  {
                    !loading
                    ? <HiOutlineSpeakerWave className={styles.icon} size={30}/>
                    : <HiOutlineSpeakerXMark className={styles.icon} size={30}/>
                  }
                </div>
              </div>
            )
        }
        </div>
        <div className={styles.row}>
          <div className={styles.row_item} onClick={()=> editTicket(item.token.id,status==="waiting"?"pending":"waiting")}>
            <div className={styles.button}>{status==="waiting"?"pend":"unpend"}</div>
          </div>
          <div className={styles.row_item}>
            <div className={styles.token}>{tokens.length> 0 && item.token.ticket_no}</div>
          </div>
          <div className={styles.row_item} onClick={()=> PrepareNexta(item.token)}>
            <div className={styles.button}>Finish</div>
          </div>
        </div>
      </div>
        ))
      }
      {tokens.length > 0 && (
        <div className={styles.chini}>
          <div className={styles.top}>
            <div className={cx(styles.item,status==="waiting" && styles.active)} onClick={()=> handleStatus("waiting")}>
              <p>On Queue: <span> <Ticket_Category_Length category="accounts" status='waiting'/> </span> </p>
            </div>
            <div className={cx(styles.item,status==="pending" && styles.active)} onClick={()=> handleStatus("pending")}>
              <p>Pending: <span><Ticket_Category_Length category="accounts" status='pending'/></span> </p>
            </div>
            <div className={cx(styles.item,status==="all" && styles.active)} onClick={()=> handleStatus("all")}>
              <p>All: <span><AllTickets/></span></p>
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
