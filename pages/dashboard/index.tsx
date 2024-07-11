import useFetchData from '@/custom_hooks/fetch'
import React from 'react'
import styles from './dashboard.module.scss'
import { IoIosPeople } from 'react-icons/io'
import { TbCalendarMonth } from 'react-icons/tb'
import { BiCalendarWeek } from 'react-icons/bi'
import { HiReceiptRefund } from 'react-icons/hi'

export default function Dashboard() {
 const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
 const {data:week,loading:weekl,error:weeke} = useFetchData("http://localhost:5000/tickets/getWeekTickets")
 const {data:month,loading:monthl,error:monthe} = useFetchData("http://localhost:5000/tickets/getMonthTickets")
  return (
    <div className={styles.dashboard}>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Customers</h4>
                <p>{data.length}</p>
            </div>
            <div className={styles.right}><IoIosPeople className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Customers This Month</h4>
                <p>{month.length}</p>
            </div>
            <div className={styles.right}><TbCalendarMonth className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Customers This Week</h4>
                <p>{week.length}</p>
            </div>
            <div className={styles.right}><BiCalendarWeek className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Customers Today</h4>
                <p>{data.length}</p>
            </div>
            <div className={styles.right}><HiReceiptRefund className={styles.icon} size={50}/></div>
        </div>
    </div>
  )
}
