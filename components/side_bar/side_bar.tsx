import React from 'react'
import styles from './side_bar.module.scss'
import Link from 'next/link'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { GoGitMergeQueue } from 'react-icons/go'
import { MdOutlineRemoveFromQueue, MdOutlineRoomService } from 'react-icons/md'
import { FaThList } from 'react-icons/fa'

export default function SideBar() {
 const router = useRouter()
  return (
    <div className={styles.side_bar}>
        <div className={styles.logo}>
            <img src="/wait1.svg" alt="" />
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
                <li className={cx(styles.link,router.pathname==="/queue_add" && styles.active)}>
                    <MdOutlineRemoveFromQueue className={styles.icon}/>
                    <Link href="/queue_add" className={styles.link}>Queue</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/queue_list" && styles.active)}>
                    <FaThList className={styles.icon}/>
                    <Link href="/queue_list" className={styles.link}>Queue List</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/dashboard" && styles.active)}>
                    <FaThList className={styles.icon}/>
                    <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                </li>
                <li className={cx(styles.link,router.pathname==="/services" && styles.active)}>
                    <MdOutlineRoomService className={styles.icon}/>
                    <Link href="/services" className={styles.link}>Services</Link>
                </li>
            </ul>
        </div>
    </div>
  )
}
