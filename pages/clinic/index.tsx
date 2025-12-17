import React, { useEffect, useRef, useState } from "react";
import styles from "./recorder.module.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import currentUserState from "@/store/atoms/currentUser";
import cx from "classnames";
import { MdClear, MdDeleteOutline } from "react-icons/md";
import { IoArrowRedoOutline, IoSearch } from "react-icons/io5";
import currentConditionState from "@/store/atoms/current";
import axios from "axios";
import Cubes from "@/components/loaders/cubes/cubes";
import { useRouter } from "next/router";
import TimeAgo from "@/components/time";
import { GrPowerShutdown } from "react-icons/gr";
import useFetchData from "@/custom_hooks/fetch";
import { IoIosAdd, IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import SequentialAudio from "@/components/audio_player/sequential/sequential";
import isSpeakerState from "@/store/atoms/isSpeaker";
import useCreateItem from "@/custom_hooks/useCreateItem";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import messageState from "@/store/atoms/message";
import Clinic_Ticket_Category_Length from "@/components/clinic_category_length copy/ticket_category_length";
import isUserState from "@/store/atoms/isUser";
import { FaUserDoctor } from "react-icons/fa6";
import DoctorPatient from "../doctor_patient";
import DoctorPatients from "@/components/doctor_patients/doctor_patients";

function Recorder() {
  const currentUser: User = useRecoilValue(currentUserState);
  const [status, setStatus] = useState("waiting");
  const [search, setSearch] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page, setPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [docpagesize, setdocPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [disable, setDisable] = useRecoilState(currentConditionState);
  const [ticket, setTicket] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [finLoading, setFinLoading] = useState(false);
  const [next, setNext] = useState(false)
  const router = useRouter()
  const [penalized, setPenalized] = useState(false)
  const [doktas, setDoktas] = useState([])
  const { data } = useFetchData("http://localhost:5000/clinic/get_clinics")
  const [isAddittion, setAddittion] = useState(false)
  const [isAdd, setAdd] = useState(false)
  const [attendantClinics, setAttendantClinics] = useState([])
  const [active, setActive] = useState(false)
  const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
  const { createItem, loading } = useCreateItem()
  const setMessage = useSetRecoilState(messageState)
  const [videos, setVideos] = useState([])
  const [isVideo, setVideo] = useState(false)
  const [devices, setDevices] = useState([])
  const [isUser, setUser] = useRecoilState(isUserState)
  const [totalItems, setTotalItems] = useState(0);
  const [isDoctors, setIsDoctors] = useState(false)
  const [vid, setVid] = useState({
    index: 0,
    clicked: false,
    device: ""
  })
  const [currentToken, setCurrentToken] = useState({
    ticket_no: "",
    stage: "",
    counter: ""
  })
  const [servePatient, setServePatient] = useState({
    isServePatient: false,
    name: "",
    id: "",
    doctor_id: "",
    loading: false
  })
  const [serveDoc, setServeDoc] = useState("")
  const [fields, setFields] = useState({
    doctor_id: '',
    patient_id: '',
    room: '',
    clinic: "",
    clinic_code: "",
    calling_token: ""
  })


  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      if (Object.keys(attendantClinics).length > 0) {
        getTicks()
      }
      getVideos()
      //getDoktas()
      getDocClinics()
      getActive()
      getClinicDevices()
    }
  }, [status, disable, ticket, currentUser, active, fields.clinic_code, currentToken, attendantClinics.length, page, pagesize]);

  useEffect(() => {
    if (currentUser.clinics !== undefined && currentUser.clinics.length > 0) {
      getDoktas()
    }
  }, [currentUser, page, pagesize, totalItems, totalPages])
  const PrepareDisplay = (index: number) => {
    setVid({ ...vid, index: index, clicked: true })
  }
  const getVideos = () => {
    axios.get("http://localhost:5000/uploads/get_videos").then((data) => {
      setVideos(data.data)
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        setTimeout(() => {
          setMessage({ ...onmessage, title: "", category: "" })
        }, 5000)
      } else {
        setMessage({ ...onmessage, title: error.message, category: "error" })
        setTimeout(() => {
          setMessage({ ...onmessage, title: "", category: "" })
        }, 5000)
      }
    })
  }

  const handleCurrentClinic = (code: string) => {
    if (code === "all") {
      axios.post('http://localhost:5000/current_clinic/create_current', { clinic_code: "", clinic_name: "" }).then((data) => {
        setFields({ ...fields, clinic_code: "", clinic: "" })
      })
        .catch((error) => {
          setFetchLoading(false);
          console.log(error.response)
          if (error.response && error.response.status === 400) {
            //console.log(`there is an error ${error.message}`);
            setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
          } else {
            //console.log(`there is an error message ${error.message}`);
            setMessage({ ...onmessage, title: error.message, category: "error" })
          }
        });
    } else {
      const clinic = data.find((item: any) => item.clinicicode === code)
      setFields({ ...fields, clinic: clinic.cliniciname, clinic_code: clinic.clinicicode })
      axios.post('http://localhost:5000/current_clinic/create_current', { clinic_code: clinic.clinicicode, clinic_name: clinic.cliniciname }).then((data) => {
        setFields({ ...fields, clinic: data.data.clinic_name, clinic_code: data.data.clinic_code })
      })
        .catch((error) => {
          setFetchLoading(false);
          console.log(error.response)
          if (error.response && error.response.status === 400) {
            //console.log(`there is an error ${error.message}`);
            setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
          } else {
            //console.log(`there is an error message ${error.message}`);
            setMessage({ ...onmessage, title: error.message, category: "error" })
          }
        });
    }
  }
  const getActive = () => {
    axios.get(`http://localhost:5000/active/get_active`, { params: { page: "/clinic_queue" } })
      .then((data) => {
        setActive(data.data.isActive)
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          //console.log(`there is an error ${error.message}`);
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          //console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };

  const handleNext = (item: any) => {
    setNext(true)
    setCurrentToken({ ...currentToken, ticket_no: item.token.ticket_no, stage: item.token.stage, counter: item.counter.namba })
  }

  const handlePageChange = (namba: number) => {
    setPage(namba);
  };
  const handleDocPageChange = (namba: number) => {
    setDocPage(namba);
  };

  const createClinic = () => {
    axios.post(`http://localhost:5000/attendant_clinics/create_attendant_clinic`, { clinic_code: fields.clinic_code, clinic: fields.clinic, attendant_id: currentUser.phone }).then((data) => {
      //setPat(data.data)
      setAddittion(!isAddittion)
      getDocClinics()
      setTimeout(() => {
        attendantClinics.map((item) => item)
      }, 2000)
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
      } else {
        console.log(`there is an error message ${error.message}`)
        setMessage({ ...onmessage, title: error.message, category: "error" })
      }
    })
  }
  const deleteClinic = (clinic_code: string) => {
    axios.get(`http://localhost:5000/attendant_clinics/delete_clinic`, { params: { clinic_code: clinic_code, attendant_id: currentUser.phone } }).then((data) => {
      const updatedItems = attendantClinics.filter((item: any) => item.clinic_code !== clinic_code);
      setAttendantClinics(updatedItems.map((item) => item));
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
      } else {
        console.log(`there is an error message ${error.message}`)
        setMessage({ ...onmessage, title: error.message, category: "error" })
      }
    })
  }
  const getDocClinics = () => {
    axios.get(`http://localhost:5000/attendant_clinics/get_clinics`, { params: { attendant_id: currentUser.phone } }).then((data) => {
      setAttendantClinics(data.data)
    }).catch((error) => {
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
      } else {
        console.log(`there is an error message ${error.message}`)
        setMessage({ ...onmessage, title: error.message, category: "error" })
      }
    })
  }


  const finishToken = () => {
    setFinLoading(true)
    axios.post(`http://localhost:5000/tickets/send_to_clinic`, { patient_id: fields.patient_id, doctor_id: fields.doctor_id, nurse_id: currentUser.phone }).then((data) => {
      console.log(data)
      setInterval(() => {
        setFinLoading(false)
        router.reload()
      }, 3000)
    }).catch((error) => {
      setFinLoading(false)
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
      } else {
        console.log(`there is an error message ${error.message}`)
        setMessage({ ...onmessage, title: error.message, category: "error" })
      }
    })
  }


  const getTicks = () => {
    setFetchLoading(true);
    axios.get("http://localhost:5000/tickets/getClinicTickets", {
      params: { page: page, pagesize: pagesize, status, disable, phone: ticket, stage: "nurse_station", clinic_code: attendantClinics.map((item: any) => item.clinic_code), mr_no: ticket, current_clinic: fields.clinic_code },
    })
      .then((data) => {
        console.log('clinic tickets are ', data.data)
        setTokens(data.data.data);
        setTotalPages(data.data.totalPages)
        setTotalItems(data.data.totalItems);
        setInterval(() => {
          setFetchLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.log('get tickets error ', error.response)
        setFetchLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };
  const getDoktas = () => {
    setDocLoading(true);
    axios.get("http://localhost:5000/doktas/get_clinic_doktas", {
      params: {
        page: docPage,
        pagesize: 5,
        clinics: currentUser.clinics.map((item: any) => item.clinic_code)
      }
    })
      .then((data) => {
        setDoktas(data.data.data);
        setTotalItems(data.data.totalPages);
        setInterval(() => {
          setDocLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.log('get doktas error ', error.response.status)
        setDocLoading(false);
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };

  const preparePnF = () => {
    setPenalized(true)
    setNext(true)
    console.log('penalized ', penalized)
  }
  const prepareDoctorPush = (doctor: string) => {
    const doc = doktas.find((doka: Doctor) => doka.phone === doctor)
    if (doc) {
      const docta: Doctor = doc
      setFields({ ...fields, doctor_id: doctor, patient_id: tokens[0].token.mr_no, room: docta.room })
    }
  }
  const editTicket = (id: number, status: string) => {
    setFetchLoading(true);
    axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`, { status: status })
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
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };

  const handleClinic = (code: string) => {
    const clinic = data.find((item: { clinicicode: string }) => item.clinicicode === code)
    setFields({ ...fields, clinic: clinic.cliniciname, clinic_code: code })
  }

  const signOut = () => {
    localStorage.removeItem('token')
    router.reload()
  }
  const penalize = (id: number) => {
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
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };
  const activate = (page: string, video: string, device: string) => {
    console.log(page, device, video)
    setFetchLoading(true);
    axios.post(`http://localhost:5000/active/activate`, { page: page, video: video, device: device })
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
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
          setTimeout(() => {
            setMessage({ ...onmessage, title: "", category: "" })
          }, 2000)
        } else {
          setMessage({ ...onmessage, title: error.message, category: "error" })
          setTimeout(() => {
            setMessage({ ...onmessage, title: "", category: "" })
          }, 2000)
        }
      });
  };
  const getClinicDevices = () => {
    axios.get(`http://localhost:5000/active/get_clinic_devices`)
      .then((data: any) => {
        setDevices(data.data)
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error.response)
        if (error.response && error.response.status === 400) {
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
          setTimeout(() => {
            setMessage({ ...onmessage, title: "", category: "" })
          }, 2000)
        } else {
          setMessage({ ...onmessage, title: error.message, category: "error" })
          setTimeout(() => {
            setMessage({ ...onmessage, title: "", category: "" })
          }, 2000)
        }
      });
  };
  const priotize = (ticket_no: string, data: string, counter: number) => {
    setFetchLoading(true);
    axios.get(`http://localhost:5000/tickets/priority`, {
      params: { ticket_no, data, stage: "nurse_station", counter: counter }, headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
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
          setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ ...onmessage, title: error.message, category: "error" })
        }
      });
  };

  const getClicName = (code: string) => {
    const name = data.find((item: any) => item.clinicicode === code)
    return name.cliniciname
  }
  const displayDoctor = (id: number) => {
    const doctor: any = doktas.find((item: any) => item.id === id)
    if (doctor) {
      return doctor.name
    } else {
      return "N/A"
    }
  }
  const showLoad = (id: string) => {
    console.log('serving id ', id, serveDoc)
    if (servePatient.loading) {
      if (id == serveDoc) {
        return "Loading.."
      } else {
        return "Assign"
      }
    } else {
      return "Assign"
    }
  }

  const assignDoctor = (patient_id: number, doctor_id: number) => {
    setServePatient({ ...servePatient, loading: true })
    setServeDoc(doctor_id.toString())
    axios.post("http://localhost:5000/doktas/assign_doctor", { patient_id: patient_id, doctor_id: doctor_id }).then((data) => {
      setTimeout(() => {
        setServePatient({ ...servePatient, loading: false, id: "", name: '' })
        setIsDoctors(false)
        location.reload()
      }, 3000)
    }).catch((error) => {
      setTimeout(() => {
        setServePatient({ ...servePatient, loading: false })
      }, 3000)
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`);
        setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
      } else {
        console.log(`there is an error message ${error.message}`);
        setMessage({ ...onmessage, title: error.message, category: "error" })
      }
    })
  }

  const prepareAssign = (name: string, id: string) => {
    console.log(name, id)
    setIsDoctors(true)
    setServePatient({ ...servePatient, isServePatient: true, name: name, id: id })
  }

  const onPageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getTicks()
  };

  const prepareCall = (token: string, stage: string, station: string, url: string, counter: string, phone: string) => {
    setFields({ ...fields, calling_token: token })
    createItem(token, stage, station, url, counter, phone)
  }

  return (
    <div className={styles.recorder}>
      {
        isVideo && (
          <div className={styles.overlay02}>
            <div className={styles.contentasa}>
              <div className={styles.close} onClick={() => setVideo(false)}>close</div>
              {
                videos.length > 0 && (
                  <div className={styles.video_list}>
                    <div className={styles.title}>
                      <h1>Display Videos</h1>
                    </div>
                    {
                      videos.map((item: any, index: number) => (
                        <div className={styles.video_item} key={index}>
                          <div className={styles.video_wrapper}>
                            <p>{item.name}</p>
                            <div className={styles.video}>
                              <video src={item.url} />
                            </div>
                            {/* <div className={styles.action} onClick={()=> activate("/clinic_queue",item.url,"")}>set</div> */}
                            <div className={styles.action} onClick={() => PrepareDisplay(index + 1)}>set</div>
                          </div>
                          {
                            (index + 1 === vid.index && vid.clicked) && (
                              <div className={styles.display_devices}>
                                {
                                  devices.map((vid: any, index: number) => (
                                    <div className={styles.deva} onClick={() => activate("/clinic_queue", item.url, vid.macAddress)}>{vid.id}</div>
                                  ))
                                }
                              </div>
                            )
                          }
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
      <div className={styles.meds_top}>
        <div className={styles.left}>
          {currentUser.name !== undefined && <h4>{currentUser.name}|<span>{currentUser.role}</span>|<span>{currentUser.counter === undefined ? currentUser.room : currentUser.counter}</span> </h4>
          }
          {
            currentUser.name !== undefined && (
              <div className={styles.out} onClick={signOut}>
                <GrPowerShutdown />
              </div>
            )
          }
          {
            currentUser.name !== undefined && (
              <div className={styles.out} onClick={() => setAdd(!isAdd)}>
                <IoMdAdd />
              </div>
            )
          }
          <div className={styles.rest} onClick={() => setVideo(true)}>
            {/* <div className={styles.rest} onClick={()=> activate("/accounts_queue",act)}> */}
            {!active ? "rest" : "activate"}
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
                ? <MdClear className={styles.icon__} onClick={() => setSearch(!search)} size={40} />
                : <IoSearch className={styles.icon__} onClick={() => setSearch(!search)} size={40} />
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
            <label>Clinic:</label>
            <select onChange={(e) => handleCurrentClinic(e.target.value)} value={fields.clinic_code}>
              <option value="" selected disabled>--Select Clinic--</option>
              <option value="all">All</option>
              {
                data.map((item: any, index: number) => (
                  <option value={item.clinicicode} key={index}>{item.cliniciname}/{item.clinicicode}</option>
                ))
              }
            </select>
          </div>
          <div className={styles.show_doctors} onClick={() => setIsDoctors(true)}>
            <FaUserDoctor className={styles.icon___} />
          </div>
          <div className={styles.side}>
            <div className={styles.image} style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }} onClick={() => setUser(true)}>
              <img src="/place_holder.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      </div>
      {
        isDoctors && (
          <div className={styles.doctors_overlay}>
            <div className={styles.content}>
              <div className={styles.close} onClick={() => setIsDoctors(false)}>close</div>
              {
                doktas.length > 0
                  ? <div className={styles.doctor_list}>
                    <div className={styles.title}>
                      <h3>{servePatient.isServePatient
                        ? `${servePatient.name}`
                        : "Clinic Doctors"}</h3>
                    </div>
                    <div className={styles.head_item}>
                      <div className={styles.item}>
                        <p>#</p>
                      </div>
                      <div className={styles.item}>
                        <p>Name</p>
                      </div>
                      <div className={styles.item}>
                        <p>Room</p>
                      </div>
                      <div className={styles.item}>
                        <p>Clinic</p>
                      </div>
                      <div className={styles.item}>
                        <p>Status</p>
                      </div>
                      <div className={styles.item}>
                        <p>Patients</p>
                      </div>
                      {
                        servePatient.isServePatient && (
                          <div className={styles.item}>
                            <p>Action</p>
                          </div>
                        )
                      }
                    </div>
                    {
                      doktas.map((item: any, index: number) => (
                        <div className={styles.list_item} key={item.id} onLoad={() => setServePatient({ ...servePatient, doctor_id: item.id })}>
                          <div className={styles.item}>
                            <p>{index + 1}</p>
                          </div>
                          <div className={styles.item}>
                            <p>{item.name}</p>
                          </div>
                          <div className={styles.item}>
                            <p>{item.room}</p>
                          </div>
                          <div className={styles.item}>
                            <p>{getClicName(item.clinic_code)}</p>
                          </div>
                          <div className={styles.item}>
                            <p>{item.status === undefined ? "N/A" : item.status}</p>
                          </div>
                          <div className={styles.item}>
                            <DoctorPatients itema={item.id} />
                          </div>
                          {
                            servePatient.isServePatient && (
                              <div className={styles.item}>
                                <div className={styles.action} onClick={() => assignDoctor(Number(servePatient.id), item.id)}>
                                  <p>{showLoad(item.id)}</p>
                                </div>
                              </div>
                            )
                          }
                        </div>
                      ))
                    }
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                      {Array.from({ length: totalItems }).map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handleDocPageChange(index + 1)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: index + 1 === docPage ? '#007bff' : '#fff',
                            color: index + 1 === docPage ? '#fff' : '#000',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = index + 1 === docPage ? '#0056b3' : '#f0f0f0'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = index + 1 === docPage ? '#007bff' : '#fff'}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  : <div className={styles.message}>no doctors</div>
              }
            </div>
          </div>
        )
      }
      <div className={cx(styles.overlay01, isAdd && styles.active)}>
        <div className={styles.contents}>
          <div className={styles.close} onClick={() => setAdd(false)}>close</div>
          <div className={styles.top}>
            <div className={styles.left}>
              <h1>{currentUser.role}'s clinics</h1>
            </div>
            <div className={styles.left}>
              <div className={styles.act} onClick={() => setAddittion(!isAddittion)}>
                {
                  !isAddittion
                    ? <IoIosAdd className={styles.icon____} size={20} />
                    : <FiMinus className={styles.icon____} size={20} />
                }
              </div>
            </div>
          </div>
          {
            isAddittion
              ? <div className={styles.addittion}>
                <select
                  value={fields.clinic_code}
                  onChange={e => handleClinic(e.target.value)}
                >
                  <option value="">--Select an option--</option>
                  {
                    data.map((item: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined }, index: number) => (
                      <option value={item.clinicicode} key={index}>{item.cliniciname}</option>
                    ))
                  }
                </select>
                <button onClick={() => createClinic()}>submit</button>
              </div>
              : <div className={styles.display_clinics}>
                {
                  attendantClinics.map((item: any, index) => (
                    <div className={styles.display_item} key={index}>
                      <div className={styles.name}>{item.clinic}</div>
                      <div className={styles.delete} onClick={() => deleteClinic(item.clinic_code)}>
                        <MdDeleteOutline className={styles.icona} />
                      </div>
                    </div>
                  ))
                }
                {
                  attendantClinics.length === 0 && (
                    <h2>No Clinics</h2>
                  )
                }
              </div>
          }
        </div>
      </div>
      <div className={cx(styles.overlay, next && styles.active)}>
        <div className={styles.next_stage}>
          <div className={styles.close} onClick={() => setNext(false)}>close</div>
          <form>
            {
              docLoading
                ? <select>
                  <option value="" selected disabled>loading..</option>
                </select>
                : <div className={styles.other}>
                  <label htmlFor="">Select Doctor</label>
                  {
                    doktas.length > 0
                      ? <select
                        onChange={e => prepareDoctorPush(e.target.value)}
                      >
                        <option value="" selected disabled>Select Doctor</option>
                        {
                          doktas.map((item: Doctor, index: number) => (
                            <option value={item.phone}>{item.name}</option>
                          ))
                        }
                      </select>
                      : <select>
                        <option value="" selected disabled>No Available Doctors</option>
                      </select>
                  }
                </div>
            }
            <div className={styles.buttons}>
              <div onClick={() => finishToken()} className={styles.button}>Submit</div>
              {
                (fields.room !== '' && tokens.length > 0) && (
                  <div className={cx(styles.spika, loading && styles.active)} onClick={() => setSpeaker(!isSpeaker)}>
                    <div className={styles.rounder} onClick={() => createItem(currentToken.ticket_no.toString(), "nurse_station", "m02", "http://localhost:5000/speaker/create_speaker", fields.room, currentUser.phone)}>
                      {
                        !loading
                          ? <HiOutlineSpeakerWave className={styles.icon} size={30} />
                          : <HiOutlineSpeakerXMark className={styles.icon} size={30} />
                      }
                    </div>
                  </div>
                )
              }
            </div>
          </form>
          <div className={cx(styles.fin_loader, finLoading && styles.active)}>
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
                      <th>Name</th>
                      <th>Token</th>
                      <th>Mr-Number</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Billing Time</th>
                      <th>Category</th>
                      <th>Clinic</th>
                      <th>Doctor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((item: Token, index: number) => (
                      <tr key={index} className={cx(index % 2 === 0 && styles.even)}>
                        <td>{index + 1}</td>
                        <td>{item.token.name}</td>
                        <td>{item.token.ticket_no}</td>
                        <td>{item.token.mr_no}</td>
                        <td>{item.token.gender}</td>
                        <td>{item.token.status}</td>
                        <td><TimeAgo isoDate={new Date(item.token.account_time).toISOString()} /></td>
                        <td>{item.token !== undefined ? item.token.category !== null ? item.token.category : "N/A" : item.token}</td>
                        <td>{getClicName(item.token.clinic_code)}</td>
                        <td>{displayDoctor(Number(item.token.doctor_id))}</td>
                        {/* <td>{item.token.clinic_code}</td> */}
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.action}>
                              <div className={cx(styles.serve, (loading && fields.calling_token === item.token.ticket_no.toString()) && styles.calling)} onClick={() => prepareCall(item.token.ticket_no.toString(), "meds", "m02", "http://localhost:5000/speaker/create_speaker", currentUser.counter, currentUser.phone)}>{loading && fields.calling_token === item.token.ticket_no.toString() ? "calling.." : "call"}/{item.token.calls === null ? 0 : item.token.calls}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve, item.token.serving && styles.active)} onClick={() => priotize(`${item.token.ticket_no}`, "serve", Number(currentUser.counter))}>{item.token.serving === true ? "serving" : "Serve"}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve, item.token.disabled && styles.priority)} onClick={() => priotize(`${item.token.ticket_no}`, "priority", Number(currentUser.counter))}>{item.token.disabled ? "prioritized" : "prioritize"}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve, item.token.disabled && styles.priority)} onClick={() => editTicket(item.token.id, status === "pending" ? "waiting" : "pending")}>{item.token.status === "waiting" ? "pend" : "unpend"}</div>
                            </div>
                            <div className={styles.action}>
                              <div className={cx(styles.serve, item.token.disabled && styles.priority)} onClick={() => prepareAssign(item.token.name, `${item.token.id}`)}>Finish</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '24px 0',
                    padding: '10px 0'
                  }}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          padding: '10px 16px',
                          border: '1px solid #dfe6e9',
                          borderRadius: '8px',
                          backgroundColor: page === index + 1 ? '#2c5282' : '#ffffff',
                          color: page === index + 1 ? '#ffffff' : '#2c3e50',
                          fontSize: '14px',
                          fontWeight: '500',
                          fontFamily: "'Inter', sans-serif",
                          cursor: 'pointer',
                          transition: 'all 0.3s ease-in-out',
                          boxShadow: page === index + 1 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                          outline: 'none',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = page === index + 1 ? '#2b6cb0' : '#edf2f7';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = page === index + 1 ? '#2c5282' : '#ffffff';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
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
        tokens.filter((item) => item.token.serving === true && item.token.serving_id === currentUser.phone && item.token.status === status).slice(0, 1).map((item: Token, index: number) => (
          <div
            className={cx(
              styles.serving,
              tokens.length > 0 && !fetchLoading && styles.active
            )}
          >
            <div className={cx(styles.spika, loading && styles.active)} onClick={() => setSpeaker(!isSpeaker)}>
              <div className={styles.rounder} onClick={() => createItem(item.token.ticket_no.toString(), "nurse_station", "m02", "http://localhost:5000/speaker/create_speaker", currentUser.counter, currentUser.phone)}>
                {
                  !loading
                    ? <HiOutlineSpeakerWave className={styles.icon} size={30} />
                    : <HiOutlineSpeakerXMark className={styles.icon} size={30} />
                }
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row_item} onClick={() => editTicket(item.token.id, status === "pending" ? "waiting" : "pending")}>
                <div className={styles.button}>{status === "pending" ? "Unpend" : "Pend"}</div>
              </div>
              <div className={styles.row_item}>
                <div className={styles.token}>{tokens.length > 0 && item.token.ticket_no}</div>
              </div>
              {/* <div className={styles.row_item} onClick={() => handleNext(item)}> */}
              <div className={styles.row_item} onClick={() => prepareAssign(item.token.name, `${item.token.id}`)}>
                <div className={styles.button}>Finish</div>
              </div>
            </div>
          </div>
        ))
      }
      {tokens.length > 0 && (
        <div className={styles.chini}>
          <div className={styles.top}>
            <div className={styles.item}>
              <p>On Queue: <span> <Clinic_Ticket_Category_Length category="nurse_station" status='waiting' clinics={attendantClinics.map((item: any) => item.clinic_code)} current_clinic={Number(fields.clinic_code)} /> </span> </p>
            </div>
            <div className={styles.item}>
              <p>Pending: <span><Clinic_Ticket_Category_Length category="nurse_station" status='pending' clinics={attendantClinics.map((item: any) => item.clinic_code)} current_clinic={Number(fields.clinic_code)} /></span> </p>
            </div>
            <div className={styles.item}>
              <p>Cancelled: <span><Clinic_Ticket_Category_Length category="nurse_station" status='cancelled' clinics={attendantClinics.map((item: any) => item.clinic_code)} current_clinic={Number(fields.clinic_code)} /></span> </p>
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
