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
        axios.get("http://localhost:5000/tickets/getCatTickets",{params: {page,pagesize,category:category??"Radiology",status}}).then((data)=> {
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
export default Ticket_Category_Length;
