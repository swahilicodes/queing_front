import messageState from '@/store/atoms/message';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil';

interface MyComponentProps {
    stage: string;
    status: string;
  }
  const Medicine_Category_Length: React.FC<MyComponentProps> = ({stage,status}) => {
    const setMessage = useSetRecoilState(messageState)
    const [tickets,setTickets] = useState<any>(0)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
        console.log()
      }, [stage,status]);
    
      const getTickets = () => {
        axios.get("http://192.168.30.246:5000/patients/status_totals",{params: {stage,status}}).then((data)=> {
          setTickets(data.data)
        }).catch((error)=> {
          if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
        }
        })
      }
  return (
    <div>{tickets.length>0?tickets.length:0}</div>
  )
}
export default Medicine_Category_Length;
