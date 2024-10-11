import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./recorder.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import currentUserState from "@/store/atoms/currentUser";
import cx from "classnames";
import { MdOutlineClear } from "react-icons/md";
import { IoArrowRedoOutline, IoSearch } from "react-icons/io5";
import Ticket_Category_Length from "@/components/ticket_category_length/ticket_category_length";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import currentConditionState from "@/store/atoms/current";
import axios from "axios";
import Cubes from "@/components/loaders/cubes/cubes";
import SequentialAudioPlayer from "@/components/audio_player/audio";
import { useRouter } from "next/router";

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
  

  useEffect(() => {
    getTicks();
  }, [status, disable, ticket]);

  const editTicket = (id:string,status:string) => {
    setFinLoading(true)
    axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`,{status: "",disable}).then((data:any)=> {
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
    axios.get("http://localhost:5000/tickets/getMedsTickets", {
        params: { page, pagesize, status, disable, phone: ticket },
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
  const nextToken = (e: React.FormEvent) => {
    e.preventDefault()
    setFinLoading(true);
    axios.get("http://localhost:5000/tickets/next_stage", {
        params: { mr_number: mr_number },
      })
      .then((data) => {
        setFound(true)
        setPatName(data.data[0].fullname)
        setFinLoading(false);
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
            onClick={() => setSearch(!search)}
          >
            {search ? (
              <MdOutlineClear size={20} className={styles.icon___} />
            ) : (
              <IoSearch size={20} className={styles.icon___} />
            )}
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
                <input 
                type="text"
                placeholder="Mr Number" 
                value={mr_number}
                onChange={e => setMrNumber(e.target.value)}
                />
                {
                    !patName
                    ? <p>Patient: -----</p>
                    : <p>Patient: <span>{patName}</span></p>
                }
                <div className={styles.buttons}>
                <button onClick={nextToken}>Search</button>
                <button onClick={nextToken} className={cx(styles.finish, found && styles.found)}>Finish</button>
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
                      <th>Token</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((item:Token, index: number) => (
                      <tr key={index} className={cx(index%2 === 0 && styles.even)}>
                        <td>{item.ticket_no}</td>
                        <td>{item.phone}</td>
                        <td>{item.status}</td>
                        <td>{item.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.wrap}>There is no Data</div>
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
            tokens.length > 0 && (<SequentialAudioPlayer  token={`${tokens[0].ticket_no}`} counter={`${tokens[0].ticket_no}`}/>)
        }
        </div>
        <div className={styles.row}>
          <div className={styles.row_item}>
            <div className={styles.button}>Pend</div>
          </div>
          {/* <div className={styles.row_item} onClick={nextToken}> */}
          <div className={styles.row_item} onClick={()=> setNext(true)}>
            <div className={styles.button}>Finish</div>
          </div>
          <div className={styles.row_item}>
            <div className={styles.token}>{tokens.length> 0 && tokens[0].ticket_no}</div>
          </div>
          <div className={styles.row_item}>
            <div className={styles.button}>Cancel</div>
          </div>
          <div className={styles.row_item}>
            <div className={styles.button}>Cancel</div>
          </div>
        </div>
      </div>
      {tokens.length > 0 && (
        <div className={styles.chini}>
          <div className={styles.top}>
            <div className={styles.item}>
              {/* <p>On Queue: <span> <Ticket_Category_Length category="meds" status='waiting'/> </span> </p> */}
              <p>
                On Queue: <span> 12</span>{" "}
              </p>
            </div>
            <div className={styles.item}>
              {/* <p>Pending: <span><Ticket_Category_Length category="meds" status='pending'/></span> </p> */}
              <p>
                Pending: <span>0</span>{" "}
              </p>
            </div>
            <div className={styles.item}>
              {/* <p>Cancelled: <span><Ticket_Category_Length category="meds" status='cancelled'/></span> </p> */}
              <p>
                Cancelled: <span>12</span>{" "}
              </p>
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
