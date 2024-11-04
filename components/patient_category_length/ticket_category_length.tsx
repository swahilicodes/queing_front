import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface MyComponentProps {
    category: string;
    status: string;
  }
  const Patient_Category_Length: React.FC<MyComponentProps> = ({category,status}) => {
    const [tickets,setTickets] = useState<any>(0)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
        console.log()
      }, [category,status]);
    
      const getTickets = () => {
        axios.get("https://qms-back.mloganzila.or.tz/patients/getCatPatients",{params: {page,pagesize,category:category??"mazoezi",status}}).then((data)=> {
          setTickets(data.data.totalItems)
        }).catch((error)=> {
          if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
        })
      }
  return (
    <div>{tickets>0?tickets:0}</div>
  )
}
export default Patient_Category_Length;
