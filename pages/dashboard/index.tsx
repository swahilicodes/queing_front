import useFetchData from '@/custom_hooks/fetch'
import React from 'react'
import styles from './dashboard.module.scss'
import { IoIosPeople } from 'react-icons/io'
import { TbCalendarMonth } from 'react-icons/tb'
import { BiCalendarWeek } from 'react-icons/bi'
import { HiReceiptRefund } from 'react-icons/hi'
import { GiMedicines } from 'react-icons/gi'
import { FaUserLock } from 'react-icons/fa'
import { GrUserWorker } from 'react-icons/gr'
import { MdCountertops } from 'react-icons/md'
import { FcAdvertising } from 'react-icons/fc'
import { useRouter } from 'next/router'
import { useSetRecoilState } from 'recoil'
import messageState from '@/store/atoms/message'

export default function Dashboard() {
 const {data} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/tickets/getTickets`)
 const {data:week} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/tickets/getWeekTickets`)
 const {data:month} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/tickets/getMonthTickets`)
 const {data:services} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/services/get_all_services`)
 const {data:admins} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/admins/get_all_admins`)
 const {data:attends} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/attendants/get_all_attendants`)
 const {data:counters} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/counters/get_all_counters`)
 const {data:ads} = useFetchData(`${process.env.NEXT_PUBLIC_API_URL}/adverts/get_all_adverts`)
 
 const router = useRouter()
  return (
    <div className={styles.dashboard}>
        <div className={styles.dash_top}>
            <div className={styles.dash_left}>{router.pathname}</div>
        </div>
        <div className={styles.wraper}>
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
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Clinics</h4>
                <p>{services.length}</p>
            </div>
            <div className={styles.right}><GiMedicines className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Admins</h4>
                <p>{admins.length}</p>
            </div>
            <div className={styles.right}><FaUserLock className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Attendants</h4>
                <p>{attends.length}</p>
            </div>
            <div className={styles.right}><GrUserWorker className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Counters</h4>
                <p>{counters.length}</p>
            </div>
            <div className={styles.right}><MdCountertops className={styles.icon} size={50}/></div>
        </div>
        <div className={styles.dash}>
            <div className={styles.left}>
                <h4>Adverts</h4>
                <p>{ads.length}</p>
            </div>
            <div className={styles.right}><FcAdvertising className={styles.icon} size={50}/></div>
        </div>
    </div>
   </div>
  )
}
