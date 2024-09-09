import React from 'react'
import styles from './side_bar.module.scss'
import Link from 'next/link'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { GoGitMergeQueue } from 'react-icons/go'
import { MdOutlineAdminPanelSettings, MdOutlineCountertops, MdOutlineQueuePlayNext, MdOutlineRemoveFromQueue, MdOutlineRoomService } from 'react-icons/md'
import { FaHandHoldingMedical, FaSignInAlt, FaThList } from 'react-icons/fa'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { useRecoilState, useRecoilValue } from 'recoil'
import currentUserState from '@/store/atoms/currentUser'
import { FiSettings } from 'react-icons/fi'
import { FcAdvertising } from 'react-icons/fc'
import { IoArrowRedoOutline, IoArrowUndoOutline } from 'react-icons/io5'
import { FaUserDoctor } from 'react-icons/fa6'
import { RiNurseFill } from 'react-icons/ri'

export default function SideBar() {
 const router = useRouter()
 const [currentUser,setCurrentUser] = useRecoilState<any>(currentUserState)

 const signOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({})
    router.push('/login')
 }
  return (
    <div className={styles.side_bar}>
        <div className={styles.logo}>
            {/* <img src="/wait1.svg" alt="" /> */}
            <img src="/mnh.png" alt="" />
            <div className={styles.title}>
            <h1>MLOGANZILA</h1>
            <p>Queing System</p>
            </div>
        </div>
        <div className={styles.links}>
            <ul>
               <li className={cx(styles.link,router.pathname==="/" && styles.active)}>
                    <GoGitMergeQueue className={styles.icon}/>
                    <Link href="/" className={styles.link}>Home</Link>
                </li>
                {/* {
                    (currentUser.role==="attendant" || currentUser.role === undefined) && (<li className={cx(styles.link,router.pathname==="/" && styles.active)}>
                    <GoGitMergeQueue className={styles.icon}/>
                    <Link href="/" className={styles.link}>Home</Link>
                </li>)
                } */}
                <li className={cx(styles.link,router.pathname==="/queue_add" && styles.active)}>
                    <MdOutlineRemoveFromQueue className={styles.icon}/>
                    <Link href="/queue_add" className={styles.link}>Queue</Link>
                </li>
                {
                  (currentUser.role ==="admin" || currentUser.role ==="attendant") && (<li className={cx(styles.link,router.pathname==="/queue_list" && styles.active)}>
                  <MdOutlineQueuePlayNext className={styles.icon}/>
                  <Link href="/queue_list" className={styles.link}>Queue List</Link>
              </li>)  
                }
                {
                    currentUser.role==="admin" && (<li className={cx(styles.link,router.pathname==="/dashboard" && styles.active)}>
                    <FaThList className={styles.icon}/>
                    <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                </li>)
                }
                {
                    currentUser.role === "admin" && (<li className={cx(styles.link,router.pathname==="/services" && styles.active)}>
                    <MdOutlineRoomService className={styles.icon}/>
                    <Link href="/services" className={styles.link}>Services</Link>
                </li>)
                }
                {
                    currentUser.role === "admin" && (<li className={cx(styles.link,router.pathname==="/counters" && styles.active)}>
                    <MdOutlineCountertops className={styles.icon}/>
                    <Link href="/counters" className={styles.link}>Counters</Link>
                </li>)
                }
                {
                    currentUser.role === undefined && (<li className={cx(styles.link,router.pathname==="/login" && styles.active)}>
                    <IoArrowRedoOutline className={styles.icon}/>
                    <Link href="/login" className={styles.link}>Login</Link>
                </li>)
                }
                {
                    currentUser.role !== undefined && (
                        <li onClick={signOut} className={cx(styles.link,router.pathname==="/login" && styles.active)}>
                            <IoArrowUndoOutline className={styles.icon}/>
                            <div className={styles.link}>Sign Out</div>
                        </li>
                    )
                }
                {
                    (currentUser !== undefined && currentUser.role === "admin") && (<li className={cx(styles.link,router.pathname==="/settings" && styles.active)}>
                    <FiSettings className={styles.icon}/>
                    <Link href="/settings" className={styles.link}>Settings</Link>
                </li>)
                }
                {
                    (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/admins" && styles.active)}>
                    <MdOutlineAdminPanelSettings className={styles.icon}/>
                    <Link href="/admins" className={styles.link}>Admins</Link>
                </li>)
                }
                {
                    (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/adverts" && styles.active)}>
                    <FcAdvertising className={styles.icon}/>
                    <Link href="/adverts" className={styles.link}>Adverts</Link>
                </li>)
                }
                {
                    (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/attendants" && styles.active)}>
                    <FaUserDoctor className={styles.icon}/>
                    <Link href="/attendants" className={styles.link}>Attendants</Link>
                </li>)
                }
                {
                    (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/nurses" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/nurses" className={styles.link}>Nurses</Link>
                </li>)
                }
                <li className={cx(styles.link,router.pathname==="/out_patients" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/out_patients" className={styles.link}>Out Patients</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/meds" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/meds" className={styles.link}>Medical Records</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/accounts" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/accounts" className={styles.link}>Accounts</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/accounts_display" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/accounts_display" className={styles.link}>Accounts Display</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/payment" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/payment" className={styles.link}>Payment</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/clinic" && styles.active)}>
                    <RiNurseFill className={styles.icon}/>
                    <Link href="/clinic" className={styles.link}>Clinic</Link>
                </li>
            </ul>
        </div>
    </div>
  )
}
