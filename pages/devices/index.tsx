import React, { useEffect, useState } from "react";
import styles from "./devices.module.scss";
import axios from "axios";
import { MdDelete, MdDeleteOutline, MdOutlineClear } from "react-icons/md";
import { useRouter } from "next/router";
import cx from "classnames";
import { FiEdit2, FiMinus } from "react-icons/fi";
import useFetchData from "@/custom_hooks/fetch";
import { RxEnterFullScreen } from "react-icons/rx";
import useAuth from "@/custom_hooks/useAuth";
import { IoIosAdd } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import messageState from "@/store/atoms/message";

export default function Admins() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdd, setAdd] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [services, setServices] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [id, setId] = useState("");
  const setMessage = useSetRecoilState(messageState)
  const { data } = useFetchData(
    "http://192.168.30.246:5000/services/get_all_services"
  );
  const [isFull, setFull] = useState(false);
  const [desc, setDesc] = useState("");
  const [pages, setPages] = useState([]);
  const { data: clinics } = useFetchData(
    "http://192.168.30.246:5000/clinic/get_clinics"
  );
  const [isAddittion, setAddittion] = useState(false);
  const [attendantClinics, setAttendantClinics] = useState([]);
  useAuth();
  const [inputs, setInputs] = useState({
    macAddress: "",
    deviceName: "",
    deviceModel: "",
    manufucturer: "",
    page: ""
  })
  const [fields, setFields] = useState({
    page: "",
    doctor_id: "",
    patient_id: "",
    room: "",
    clinic: "",
    clinic_code: "",
    device_id: "",
  });

  useEffect(() => {
    getAttendants();
    getPages();
    if (isFull) {
      setInterval(() => {
        setFull(false);
      }, 10000);
    }
    if (fields.device_id !== "") {
      getDocClinics(fields.device_id);
    }
  }, [page, data, fields.device_id]);

  const handleClinic = (code: string) => {
    const clinic = clinics.find(
      (item: { clinicicode: string }) => item.clinicicode === code
    );
    setFields({ ...fields, clinic: clinic.cliniciname, clinic_code: code });
  };

  const createClinic = (deviceId: string) => {
    axios
      .post(`http://192.168.30.246:5000/attendant_clinics/create_attendant_clinic`, {
        clinic_code: fields.clinic_code,
        clinic: fields.clinic,
        attendant_id: deviceId,
      })
      .then((data) => {
        //setPat(data.data)
        setAddittion(!isAddittion);
        getDocClinics(fields.device_id);
        setTimeout(() => {
          attendantClinics.map((item) => item);
        }, 2000);
      })
      .catch((error) => {
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
  const deleteClinic = (clinic_code: string, device_id: string) => {
    axios
      .get(`http://192.168.30.246:5000/attendant_clinics/delete_clinic`, {
        params: { clinic_code: clinic_code, attendant_id: device_id },
      })
      .then((data) => {
        const updatedItems = attendantClinics.filter(
          (item: any) => item.clinic_code !== clinic_code
        );
        setAttendantClinics(updatedItems.map((item) => item));
      })
      .catch((error) => {
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
  const getDocClinics = (device_id: string) => {
    axios
      .get(`http://192.168.30.246:5000/attendant_clinics/get_clinics`, {
        params: { attendant_id: device_id },
      })
      .then((data) => {
        setAttendantClinics(data.data);
      })
      .catch((error) => {
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


  const editService = (e: React.FormEvent) => {
    console.log(inputs)
    e.preventDefault();
    axios
      .get(`http://192.168.30.246:5000/network/edit_device`, {
        params: { page: inputs.page, id: id, deviceName: inputs.deviceName, deviceModel: inputs.deviceModel, manufucturer: inputs.manufucturer },
      })
      .then(() => {
        setEdit(false);
        router.reload();
      })
      .catch((error) => {
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
  const deleteService = () => {
    axios
      .get(`http://192.168.30.246:5000/network/delete_device`, {
        params: { id: id },
      })
      .then(() => {
        setDelete(false);
        router.reload();
      })
      .catch((error) => {
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
  const handlePageChange = (namba: number) => {
    setPage(namba);
  };
  const handleDelete = (namba: string) => {
    setId(namba);
    setDelete(true);
  };
  const handleEdit = (namba: string, name: string, data:any) => {
    setId(namba);
    setEdit(true);
    setInputs({
        ...inputs,
        deviceName: data.deviceName,
        manufucturer: data.manufucturer,
        deviceModel: data.deviceModel,
        page: data.default_page
    })
  };

  const getPages = () => {
    axios
      .get("http://192.168.30.246:3000/api/getPages")
      .then((data) => {
        const pags = data.data.pages.map((page: string) =>
          getFirstPathSegment(page)
        );
        setPages(pags);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function getFirstPathSegment(path: string): string {
    const cleanedPath = path.replace(/\/[^\/]+$/, "");
    const segments = cleanedPath.split("/").filter(Boolean);
    return `/${segments[0] || ""}`;
  }
  const getAttendants = () => {
    setFetchLoading(true);
    axios
      .get("http://192.168.30.246:5000/network/get_devices", {
        params: { page, pagesize },
      })
      .then((data) => {
        setServices(data.data.data);
        setFetchLoading(false);
        setTotalItems(data.data.totalItems);
      })
      .catch((error: any) => {
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

  const handleAdd = (device_id: string) => {
    setAdd(true);
    setFields({ ...fields, device_id: device_id });
  };
  return (
    <div className={styles.devices}>
      <div className={styles.service_top}>
        <div className={styles.service_left}>{router.pathname}</div>
        <div className={styles.service_right} onClick={() => setAdd(!isAdd)}>
          <p>{totalItems}</p>
        </div>
      </div>
      <div className={cx(styles.overlay01, isAdd && styles.active)}>
        <div className={styles.contents}>
          <div className={styles.close} onClick={() => setAdd(false)}>
            close
          </div>
          <div className={styles.top}>
            <div className={styles.left}>
              <h1>{fields.device_id}'s clinics</h1>
            </div>
            <div className={styles.left}>
              <div
                className={styles.act}
                onClick={() => setAddittion(!isAddittion)}
              >
                {!isAddittion ? (
                  <IoIosAdd className={styles.icon____} size={20} />
                ) : (
                  <FiMinus className={styles.icon____} size={20} />
                )}
              </div>
            </div>
          </div>
          {isAddittion ? (
            <div className={styles.addittion}>
              <select
                value={fields.clinic_code}
                onChange={(e) => handleClinic(e.target.value)}
              >
                <option value="">--Select an option--</option>
                {clinics.map(
                  (
                    item: {
                      clinicicode:
                        | string
                        | number
                        | readonly string[]
                        | undefined;
                      cliniciname:
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
                    },
                    index: number
                  ) => (
                    <option value={item.clinicicode} key={index}>
                      {item.cliniciname}
                    </option>
                  )
                )}
              </select>
              <button onClick={() => createClinic(fields.device_id)}>
                submit
              </button>
            </div>
          ) : (
            <div className={styles.display_clinics}>
              {attendantClinics.map((item: any, index) => (
                <div className={styles.display_item} key={index}>
                  <div className={styles.name}>{item.clinic}</div>
                  <div
                    className={styles.delete}
                    onClick={() =>
                      deleteClinic(item.clinic_code, fields.device_id)
                    }
                  >
                    <MdDeleteOutline className={styles.icona} />
                  </div>
                </div>
              ))}
              {attendantClinics.length === 0 && <h2>No Clinics</h2>}
            </div>
          )}
        </div>
      </div>
      {isEdit && (
        <div className={styles.add_service}>
          <div className={styles.total_wrap}>
          <div className={styles.wrap}>
            <div className={styles.item}>
            <label>Default Page</label>
            <select
              value={inputs.page}
              onChange={(e) => setInputs({ ...inputs, page: e.target.value })}
            >
              <option value="" selected disabled>
                Select Page
              </option>
              <option value="/accounts">accounts</option>
              <option value="/accounts_queue">accounts_queue</option>
              <option value="/admins">admins</option>
              <option value="/adverts">adverts</option>
              <option value="/attendants">attendants</option>
              <option value="/clinic">clinic</option>
              <option value="/clinic_queue">clinic_queue</option>
              <option value="/clinics">clinics</option>
              <option value="/counters">counters</option>
              <option value="/dashboard">dashboard</option>
              <option value="/devices">devices</option>
              <option value="/doctor_patient">doctor_patient</option>
              <option value="/doktas">doktas</option>
              <option value="/graph">graph</option>
              <option value="/nurse_station">nurse_station</option>
              <option value="/nurses">nurses</option>
              <option value="/print">print</option>
              <option value="/recorder">recorder</option>
              <option value="/rooms">rooms</option>
              <option value="/services">services</option>
              <option value="/settings">settings</option>
              <option value="/speaker">speaker</option>
              <option value="/">home</option>
              {/* {pages.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))} */}
            </select>
            </div>
            <div className={styles.item}>
                <label>Name</label>
                <input 
                value={inputs.deviceName}
                onChange={e => setInputs({...inputs,deviceName: e.target.value})}
                type="text" 
                placeholder="Device Name"
                />
            </div>
            <div className={styles.item}>
                <label>Manufucturer</label>
                <input 
                value={inputs.manufucturer}
                onChange={e => setInputs({...inputs,manufucturer: e.target.value})}
                type="text" 
                placeholder="Manufucturer Name"
                />
            </div>
            <div className={styles.item}>
                <label>Device Model</label>
                <input 
                value={inputs.deviceModel}
                onChange={e => setInputs({...inputs,deviceModel: e.target.value})}
                type="text" 
                placeholder="Device Model"
                />
            </div>
          </div>
          <div className={styles.action}>
              <button onClick={editService}>submit</button>
              <div className={styles.clear} onClick={() => setEdit(false)}>
                <MdOutlineClear className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className={styles.add_service}>
          <form>
            <h4>Are You Sure?</h4>
            <div className={styles.action}>
              <div onClick={() => deleteService()} className={styles.button}>
                Yes
              </div>
              <div className={styles.clear} onClick={() => setDelete(false)}>
                <MdOutlineClear className={styles.icon} />
              </div>
            </div>
          </form>
        </div>
      )}
      <div className={styles.service_list}>
        {fetchLoading ? (
          <div className={styles.loader}>loading...</div>
        ) : (
          <div className={styles.check}>
            {services.length > 0 ? (
              <div className={styles.services_list}>
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th className={styles.name}>Mac</th>
                      <th className={styles.name}>Name</th>
                      <th className={styles.name}>Model</th>
                      <th className={styles.name}>Manufucturer</th>
                      <th className={styles.name}>Clinics</th>
                      <th className={styles.name}>Page</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((data: any, index: number) => (
                      <tr
                        key={index}
                        className={cx(index % 2 === 0 && styles.active)}
                      >
                        <td>{data.id}</td>
                        <td className={cx(styles.name,data.macAddress===localStorage.getItem("unique_id") && styles.active)}>{data.macAddress}</td>
                        <td className={styles.name}>{data.deviceName}</td>
                        <td className={styles.name}>{data.deviceModel}</td>
                        <td className={styles.name}>{data.manufucturer}</td>
                        <td className={styles.name}>{data.clinics.length}</td>
                        <td className={styles.name}>{data.default_page}</td>
                        <td>
                          <div
                            className={styles.delete}
                            onClick={() => handleDelete(data.id)}
                          >
                            <MdDelete className={styles.icon} />
                          </div>
                          <div
                            className={styles.edit}
                            onClick={() => handleAdd(data.macAddress)}
                          >
                            <IoIosAdd className={styles.icon} />
                          </div>
                          <div
                            className={styles.edit}
                            onClick={() => handleEdit(data.id, data.name, data)}
                          >
                            <FiEdit2 className={styles.icon} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  {Array.from({ length: Math.ceil(totalItems / pagesize) }).map(
                    (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={cx(index + 1 === page && styles.active)}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.message}>No Devices </div>
            )}
          </div>
        )}
      </div>
      <div className={cx(styles.toast, isFull && styles.active)}>
        <p>{desc}</p>
        <div className={styles.clear} onClick={() => setFull(false)}>
          <MdOutlineClear className={styles.icon} />
        </div>
      </div>
    </div>
  );
}
