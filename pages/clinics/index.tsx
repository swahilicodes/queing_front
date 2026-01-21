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
  const [isAdd, setAdd] = useState(false);
  const [services, setServices] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pagesize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [id, setId] = useState("");
  const setMessage = useSetRecoilState(messageState)
  const { data } = useFetchData(
    "http://192.168.30.246:5005/services/get_all_services"
  );
  useAuth();


  useEffect(() => {
    getAttendants();
  }, [page, data]);

  const handlePageChange = (namba: number) => {
    setPage(namba);
  };

  const getAttendants = () => {
    setFetchLoading(true);
    axios
      .get("http://192.168.30.246:5005/clinic/get_display_clinics", {
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

  return (
    <div className={styles.devices}>
      <div className={styles.service_top}>
        <div className={styles.service_left}>{router.pathname}</div>
        <div className={styles.service_right} onClick={() => setAdd(!isAdd)}>
          <p>{totalItems}</p>
        </div>
      </div>
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
                      <th className={styles.name}>Clinic Code</th>
                      <th className={styles.name}>Clinic Name</th>
                      <th className={styles.name}>Department</th>
                      <th className={styles.name}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((data: any, index: number) => (
                      <tr
                        key={index}
                        className={cx(index % 2 === 0 && styles.active)}
                      >
                        <td>{data.id}</td>
                        <td className={cx(styles.name)}>{data.clinicicode}</td>
                        <td className={styles.name}>{data.cliniciname}</td>
                        <td className={styles.name}>{data.deptcode}</td>
                        <td className={styles.name}>{data.status}</td>
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
              <div className={styles.message}>No Clinics</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
