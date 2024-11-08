import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface MyComponentProps {
    stage: string;
    status: string;
  }
  const Medicine_Category_Length: React.FC<MyComponentProps> = ({stage,status}) => {
    const [tickets,setTickets] = useState<any>(0)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
        console.log()
      }, [stage,status]);
    
      const getTickets = () => {
        axios.get("http://192.168.30.245:5000/patients/status_totals",{params: {stage,status}}).then((data)=> {
          setTickets(data.data)
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
    <div>{tickets.length>0?tickets.length:0}</div>
  )
}
export default Medicine_Category_Length;
