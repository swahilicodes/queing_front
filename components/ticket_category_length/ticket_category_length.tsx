import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface MyComponentProps {
    category: string;
    status: string;
  }
  const Ticket_Category_Length: React.FC<MyComponentProps> = ({category,status}) => {
    const [tickets,setTickets] = useState<any>(0)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
      }, [category,status]);
    
      const getTickets = () => {
        axios.get("https://qms-back.mloganzila.or.tz/tickets/getTicketTotal",{params: {status,stage:category}}).then((data)=> {
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
export default Ticket_Category_Length;
