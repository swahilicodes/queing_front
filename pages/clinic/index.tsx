import React, { useEffect, useRef, useState } from "react";
import styles from "./recorder.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
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

function Recorder() {
  const currentUser: User = useRecoilValue(currentUserState);
  const [status, setStatus] = useState("waiting");
  const [search, setSearch] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [, setTotalItems] = useState(0);
  const [disable, setDisable] = useRecoilState(currentConditionState);
  const [ticket, setTicket] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const [next, setNext] = useState(false)
  const router = useRouter()
  const [penalized, setPenalized] = useState(false)
  const [doktas, setDoktas] = useState([])
  const [fields, setFields] = useState({
    doctor_id: '',
    patient_id: '',
    room: ''
  })
  

  useEffect(() => {
    if(Object.keys(currentUser).length > 0 ){
      getTicks()
      getDoktas()
    }
  }, [status, disable, ticket,currentUser]);

  const finishToken = () => {
      setFinLoading(true)
    axios.post(`http://localhost:5000/tickets/send_to_clinic`,{patient_id:fields.patient_id,doctor_id: fields.doctor_id, nurse_id: currentUser.phone}).then(()=> {
      setInterval(()=> {
        setFinLoading(false)
        router.reload()
      },3000)
    }).catch((error)=> {
      setFinLoading(false)
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        alert(error.response.data.error);
    } else {
        console.log(`there is an error message ${error.message}`)
        alert(error.message);
    }
    })
  }


  const getTicks = () => {
    setFetchLoading(true);
    axios.get("http://localhost:5000/tickets/getClinicTickets", {
        params: { page, pagesize, status, disable, phone: ticket, stage: "nurse_station",clinic_code: currentUser.clinic_code, mr_no: ticket },
      })
      .then((data) => {
        setTokens(data.data.data);
        setTotalItems(data.data.totalItems);
        setInterval(() => {
          setFetchLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.log('get tickets error ',error.response.status)
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          alert(error.response.data.error);
        } else {
          console.log(`there is an error message ${error.message}`);
          alert(error.message);
        }
      });
  };
  const getDoktas = () => {
    setDocLoading(true);
    axios.get("http://localhost:5000/doktas/get_free_doktas", {
        params: { page, pagesize,clinic_code: currentUser.clinic_code},
      })
      .then((data) => {
        setDoktas(data.data.data);
        setTotalItems(data.data.totalItems);
        setInterval(() => {
          setDocLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.log('get doktas error ',error.response.status)
        setDocLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          alert(error.response.data.error);
        } else {
          console.log(`there is an error message ${error.message}`);
          alert(error.message);
        }
      });
  };

  const preparePnF = () => {
    setPenalized(true)
    setNext(true)
    console.log('penalized ',penalized)
  }
  const prepareDoctorPush = (doctor: string) => {
    const doc = doktas.find((doka:Doctor)=> doka.phone===doctor)
    if(doc){
      const docta: Doctor = doc
      setFields({...fields,doctor_id: doctor,patient_id: tokens[0].token.mr_no,room: docta.room})
    }
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
          alert(error.response.data.error);
        } else {
          console.log(`there is an error message ${error.message}`);
          alert(error.message);
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
          alert(error.response.data.error);
        } else {
          console.log(`there is an error message ${error.message}`);
          alert(error.message);
        }
      });
  };
  return (
    <div className={styles.recorder}>
      <div className={styles.meds_top}>
        <div className={styles.left}>
          {currentUser.name !== undefined && <h4>{currentUser.name}|<span>{currentUser.role}</span> </h4> 
          }
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
          <div className={styles.side}>
            <label>Status:</label>
            <select onChange={(e) => setStatus(e.target.value)} value={status}>
              <option value="waiting">waiting</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
              <option value="pending">pending</option>
            </select>
          </div>
        </div>
      </div>
      <div className={cx(styles.overlay, next && styles.active)}>
        <div className={styles.next_stage}>
            <div className={styles.close} onClick={()=> setNext(false)}>close</div>
            <form>
              {
                docLoading
                ? <select>
                  <option value="" selected disabled>loading..</option>
                </select>
                : <div className={styles.other}>
                  <label htmlFor="">Select Doctor</label>
                  {
                    doktas.length>0 
                    ? <select
                    onChange={e => prepareDoctorPush(e.target.value)}
                    >
                    <option value="" selected disabled>Select Doctor</option>
                    {
                      doktas.map((item:Doctor,index:number)=> (
                        <option value={item.phone}>{item.name}</option>
                      ))
                    }
                  </select>
                  :<select>
                  <option value="" selected disabled>No Available Doctors</option>
                </select>
                  }
                </div>
              }
                <div className={styles.buttons}>
                <div onClick={()=> finishToken()} className={styles.button}>Submit</div>
                  {
                    (fields.room !== '' && tokens.length > 0 ) &&(
                      <div className={styles.button}>
                        <AudioTest token={`${tokens[0].token.ticket_no}`} counter={`${tokens[0].counter===undefined?"1":tokens[0].counter.namba}`} stage={tokens[0].token.stage} isButton={true}/>
                        {/* <SequentialAudioPlayerFinish  token={`${tokens[0].token.ticket_no}`} counter={fields.room}/> */}
                      </div>
                    )
                  }
                {/* <div onClick={()=> found && finishToken(tokens[0].token.id,"accounts",mr_number)} className={cx(styles.button,styles.finish, found && styles.found)}>Finish</div> */}
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
                      <th>#</th>
                      <th>Token</th>
                      <th>Mr-Number</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>CreatedAt</th>
                      <th>Challenge</th>
                      <th>Clinic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((item:Token, index: number) => (
                      <tr key={index} className={cx(index%2 === 0 && styles.even)}>
                        <td>{index+1}</td>
                        <td>{item.token.ticket_no}</td>
                        <td>{item.token.mr_no}</td>
                        <td>{item.token.gender}</td>
                        <td>{item.token.status}</td>
                        <td><TimeAgo isoDate={new Date(item.token.createdAt).toISOString()} /></td>
                        <td>{item.token.disability===""?"N/A":item.token.disability}</td>
                        <td>{item.token.clinic_code}</td>
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
      <div
        className={cx(
          styles.serving,
          tokens.length > 0 && !fetchLoading && styles.active
        )}
      >
        <div className={styles.speaker}>
        {
            tokens.length > 0 && (<AudioTest token={`${tokens[0].token.ticket_no}`} counter={`${tokens[0].counter===undefined?"1":tokens[0].counter.namba}`} stage={tokens[0].token.stage} isButton={false}/>)
        }
        </div>
        <div className={styles.row}>
          <div className={styles.row_item} onClick={()=> editTicket(tokens[0].token.id,"pending")}>
            <div className={styles.button}>Pend</div>
          </div>
          {/* <div className={styles.row_item} onClick={nextToken}> */}
          {/* <div className={styles.row_item} onClick={()=> clinicGo(tokens[0].token.mr_no)}> */}
          <div className={styles.row_item} onClick={()=> setNext(true)}>
            <div className={styles.button}>Finish</div>
          </div>
          <div className={styles.row_item}>
            <div className={styles.token}>{tokens.length> 0 && tokens[0].token.ticket_no}</div>
          </div>
          <div className={styles.row_item} onClick={()=> penalize(tokens[0].token.id)}>
            <div className={styles.button}>Penalize</div>
          </div>
          <div className={styles.row_item} onClick={()=> preparePnF()}>
            <div className={styles.button}>Finish & Penalize</div>
          </div>
        </div>
      </div>
      {tokens.length > 0 && (
        <div className={styles.chini}>
          <div className={styles.top}>
            <div className={styles.item}>
              <p>On Queue: <span> <Ticket_Category_Length category="accounts" status='waiting'/> </span> </p>
            </div>
            <div className={styles.item}>
              <p>Pending: <span><Ticket_Category_Length category="accounts" status='pending'/></span> </p>
            </div>
            <div className={styles.item}>
              <p>Cancelled: <span><Ticket_Category_Length category="accounts" status='cancelled'/></span> </p>
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
