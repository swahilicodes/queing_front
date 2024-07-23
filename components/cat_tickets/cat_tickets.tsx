import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './cat_tickets.module.scss'
import cx from 'classnames'
import { FaLongArrowAltRight } from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

interface MyComponentProps {
    category: string;
  }

const CatTickets: React.FC<MyComponentProps> = ({category}) => {
const [data,setData] = useState([])
const [page,setPage] = useState(1)
const [pagesize,setPageSize] = useState(10)
const [service, setService] = useState<any>({})
const socket = io('http://localhost:5000');
const router = useRouter()
 
useEffect(()=> {
    getTickets(),
    getCounter(),
    checkStatus()
},[category])
 const getTickets = () => {
    axios.get('http://localhost:5000/tickets/getCatTickets',{params: {page,pagesize,category}}).then((data:any)=> {
        setData(data.data.data)
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.response.data.error}`)
            //alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            //alert(error.message);
        }
    })
 }
 const getCounter = () => {
    console.log(category)
    axios.get('http://localhost:5000/tickets/getTicketCounter',{params: {category:category}}).then((data:any)=> {
        console.log(data.data)
        setService(data.data)
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.response.data.error}`)
            //alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            //alert(error.message);
        }
    })
 }

 const checkStatus = () => {
    // socket.on('connect', () => {
    //     console.log('Connected to server');
    //     socket.emit('data', 'Hello Server');
    //   });
      socket.on('data', (msg) => {
        if(msg){
            console.log(msg.route)
            if(msg.route==="tickets"){
                router.reload()
            }
            //console.log(msg)
            // router.reload()
        }
      });
 }
  return (
    <div className={styles.cat_tickets}>
        {data.map((item:any,index:number)=> (
            <div className={cx(styles.cat_ticket,index%2===0 && styles.even)} key={index}>
                <div className={styles.left}>{item.ticket_no}<FaArrowTrendUp className={styles.cat_ticket_icon}/> <span>{service!==null && (service.counter??"005")}</span></div>
                <div className={cx(styles.right,index===0 && styles.red,index===1 && styles.green, index===2 && styles.yellow)}>{index}</div>
            </div>
        ))}
    </div>
  )
}
export default CatTickets;
