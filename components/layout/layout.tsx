import isFull from '@/store/atoms/isFull'
import React from 'react'
import { useRecoilValue } from 'recoil'
import styles from './layout.module.scss'
import SideBar from '../side_bar/side_bar'

export default function Layout({children}:any) {
  const Full = useRecoilValue(isFull)
  return (
    <div className={styles.layout}>
      <div className={styles.side}>
        <SideBar/>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  )
}
