import isFull from '@/store/atoms/isFull'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styles from './layout.module.scss'
import { useRouter } from 'next/router'
import currentUserState from '@/store/atoms/currentUser'
import cx from 'classnames'
import Profile from '../profile/profile'
import isUserState from '@/store/atoms/isUser'
import errorState from '@/store/atoms/error'
import { BiSolidError } from 'react-icons/bi'
import 'nprogress/nprogress.css';
import isMenuState from '@/store/atoms/isMenu'
import Chakula_Menu from '../menu/menu'
import useAuth from '@/custom_hooks/useAuth'
import LoginModal from '../login_modal/login_modal'
import messageState from '@/store/atoms/message'
import { getLocalDeviceIP } from '@/custom_hooks/deviceInfo'
import axios from 'axios'


export default function Layout({children}:any) {
  const [full, setFull] = useRecoilState(isFull)
  const [isMenu, setMenu] = useRecoilState(isMenuState)
  const [isUser, setUser] = useRecoilState(isUserState)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
  const restrictedRoutes = ['/accounts','/admins','/attendants','/dashboard','/services','/settings','/adverts','/counters','/recorder','/payment','/clinic','/doctor_patient']
  const adminRoutes = ['/admins','/attendants','/counters','/dashboard','/services','/settings','/adverts','/','/login','/queue_add','/clinic','/recorder','/accounts']
  const medRoutes = ['/recorder','/','/login','/queue_add','/']
  const doctorRoutes = ['/doctor_patient','/','/login','/queue_add','/']
  const nurseRoutes = ['/clinic','/','/login','/queue_add','/']
  const accountRoutes = ['/accounts','/','/login','/queue_add']
  const [error,setError] = useRecoilState(errorState)
  const [isError, setIsError] = useState(false)
  const message = useRecoilValue(messageState)
  useAuth();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
}, [error,full, isUser,currentUser,message]);

const handleKeyDown = (event: KeyboardEvent) => {
   if(event.key === 'p'){
    setUser((prevFull) => !prevFull);
  }else if(event.key === "<"){
    setMenu((prevFull) => !prevFull)
  }else if(event.key===">"){
    if(full){
      localStorage.removeItem('token')
      setCurrentUser({})
      router.reload()
    }else{
      setFull(true)
    }
  }else if(event.key==="/"){
    setFull(false)
  }
};

const clearError = () => {
  setError("")
  setIsError(false)
}



  return (
    <div className={styles.layout}>
        <div className={cx(styles.message,message.title.trim()!=="" && styles.active,message.category==="error" && styles.danger)}>{message.title}</div>
      {
        (isUser && currentUser) && (<div className={styles.profile_page}>
          <Profile/>
        </div>)
      }
          <div className={cx(styles.menu, isMenu && styles.active)}>
            <Chakula_Menu/>
          </div>
      {
        full && (
          <div className={cx(styles.logani)}>
        <LoginModal/>
      </div>
        )
      }
      <div className={cx(styles.children)}>
        {children}
        {
        isError && (
          <div className={styles.error_overlay}>
            <div className={styles.error_content}>
              <div className={styles.error_top}>
                <BiSolidError className={styles.icon} size={60}/>
              </div>
              <div className={styles.error_conta}>
                <h1>Ooooh Sorry!</h1>
                <p>{error??"there is an error"}</p>
              </div>
              <div className={styles.close} onClick={()=> clearError()}>ok</div>
            </div>
          </div>
        )
      }
      </div>
    </div>
  )
}
