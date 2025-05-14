import messageState from '@/store/atoms/message';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil';

interface MyComponentProps {
    category: string;
    status: string;
  }
  const Ticket_Category_Length: React.FC<MyComponentProps> = ({category,status}) => {
    const [tickets,setTickets] = useState<any>(0)
    const setMessage = useSetRecoilState(messageState)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
      }, [category,status]);
    
      const getTickets = () => {
        axios.get("http://localhost:5000/tickets/getTicketTotal",{params: {status,stage:category}}).then((data)=> {
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
export default Ticket_Category_Length;
