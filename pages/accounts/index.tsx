import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./recorder.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import currentUserState from "@/store/atoms/currentUser";
import cx from "classnames";
import { MdClear, MdOutlineClear } from "react-icons/md";
import { IoArrowRedoOutline, IoSearch } from "react-icons/io5";
import Ticket_Category_Length from "@/components/ticket_category_length/ticket_category_length";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import currentConditionState from "@/store/atoms/current";
import axios from "axios";
import Cubes from "@/components/loaders/cubes/cubes";
import SequentialAudioPlayer from "@/components/audio_player/audio";
import { useRouter } from "next/router";
import TimeAgo from "@/components/time";

function Recorder() {
  const currentUser: any = useRecoilValue(currentUserState);
  const [status, setStatus] = useState("waiting");
  const [search, setSearch] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [disable, setDisable] = useRecoilState(currentConditionState);
  const [ticket, setTicket] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [next, setNext] = useState(false)
  const [mr_number, setMrNumber] = useState("")
  const [found, setFound] = useState(false)
  const [patName, setPatName] = useState("")
  const router = useRouter()
  const [penalized, setPenalized] = useState(false)
  const [bill, setBill] = useState("")
  

  useEffect(() => {
    getTicks();
  }, [status, disable, ticket]);

  const finishToken = (id:number,stage:string,mr_number:string) => {
    if(found){
      setFinLoading(true)
    axios.put(`http://localhost:5000/tickets/finish_token/${id}`,{stage:"accounts",mr_number: mr_number}).then((data:any)=> {
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
    }else{
      alert('Patient not found')
    }
  }

  const clinicGo = (mr_no:string) => {
    setFinLoading(true)
    axios.post(`http://localhost:5000/tickets/clinic_go`,{stage:"clinic",mr_number: mr_no}).then((data)=> {
      console.log('success data ',data.data)
      setFinLoading(false)
    }).catch((error)=> {
      if(error.response && error.response.status === 400){
        alert(error.response.data.error)
      }else{
        alert(error.message)
      }
    })
  }


  const getTicks = () => {
    setFetchLoading(true);
    axios.get("http://localhost:5000/tickets/getMedsTickets", {
        params: { page, pagesize, status, disable, phone: ticket, stage: "accounts" },
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
  const submit = (id:number,bill:string) => {
    setFinLoading(true);
    axios.put(`http://localhost:5000/tickets/bill/${id}`, {bill: bill})
      .then(() => {
        setFinLoading(false);
        router.reload()
      })
      .catch((error: any) => {
        setFinLoading(false);
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
          {(currentUser.name !== undefined && currentUser.name) ||
            (currentUser.counter !== undefined && currentUser.counter)}
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
              <select
              value={bill}
              onChange={e => setBill(e.target.value)}
              >
                <option value="" selected disabled>Select Billing Type</option>
                <option value="insurance">Insurance</option>
                <option value="cash">Cash</option>
              </select>
                <div className={styles.buttons}>
                <div onClick={()=> submit(tokens[0].token.id,bill)} className={styles.button}>Submit</div>
                {/* <div onClick={()=> found && finishToken(tokens[0].token.id,"accounts",mr_number)} className={cx(styles.button,styles.finish, found && styles.found)}>Finish</div> */}
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
            tokens.length > 0 && (<SequentialAudioPlayer  token={`${tokens[0].token.ticket_no}`} counter={`${tokens[0].counter===undefined?"1":tokens[0].counter.namba}`}/>)
        }
        </div>
        <div className={styles.row}>
          <div className={styles.row_item} onClick={()=> editTicket(tokens[0].token.id,"pending")}>
            <div className={styles.button}>Pend</div>
          </div>
          {/* <div className={styles.row_item} onClick={nextToken}> */}
          <div className={styles.row_item} onClick={()=> clinicGo(tokens[0].token.mr_no)}>
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
