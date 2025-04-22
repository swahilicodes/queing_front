import messageState from '@/store/atoms/message';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil';

interface MyComponentProps {
    category: string;
    status: string;
  }
  const Patient_Category_Length: React.FC<MyComponentProps> = ({category,status}) => {
    const setMessage = useSetRecoilState(messageState)
    const [tickets,setTickets] = useState<any>(0)
    const pagesize = 10
    const page = 1
    useEffect(() => {
        getTickets()
        console.log()
      }, [category,status]);
    
      const getTickets = () => {
        axios.get("http://localhost:5000/patients/getCatPatients",{params: {page,pagesize,category:category??"mazoezi",status}}).then((data)=> {
          setTickets(data.data.totalItems)
        }).catch((error)=> {
          if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
          setMessage({...onmessage,title:error.message,category: "error"})
        }
        })
      }
  return (
    <div>{tickets>0?tickets:0}</div>
  )
}
export default Patient_Category_Length;
