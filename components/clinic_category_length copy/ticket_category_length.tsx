import messageState from '@/store/atoms/message';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil';

interface MyComponentProps {
    category: string;
    status: string;
    clinics: any[],
    current_clinic: number
  }
  const Clinic_Ticket_Category_Length: React.FC<MyComponentProps> = ({category,status,clinics,current_clinic}) => {
    const [tickets,setTickets] = useState<any>(0)
    const setMessage = useSetRecoilState(messageState)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
      }, [category,status,clinics,current_clinic]);
    
      const getTickets = () => {
        axios.get("http://192.168.30.246:5000/tickets/get_clinic_length",{params: {status, stage: "nurse_station",clinic_code: clinics,current_clinic:current_clinic}}).then((data)=> {
          setTickets(data.data)
        }).catch((error)=> {
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
        })
      }
  return (
    <div>{tickets.length>0?tickets.length:0}</div>
  )
}
export default Clinic_Ticket_Category_Length;
