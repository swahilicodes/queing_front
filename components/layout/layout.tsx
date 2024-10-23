import isFull from '@/store/atoms/isFull'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styles from './layout.module.scss'
import SideBar from '../side_bar/side_bar'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'
import currentUserState from '@/store/atoms/currentUser'
import cx from 'classnames'
import Profile from '../profile/profile'
import isUserState from '@/store/atoms/isUser'
import isExpandState from '@/store/atoms/isExpand'
import { MdErrorOutline, MdOutlineAdd } from 'react-icons/md'
import { GoPerson, GoPersonAdd, GoZoomIn, GoZoomOut } from 'react-icons/go'
import { FaMinus } from 'react-icons/fa'
import errorState from '@/store/atoms/error'
import { BiSolidError } from 'react-icons/bi'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import LanguageState from '@/store/atoms/language'


export default function Layout({children}:any) {
  const [full, setFull] = useRecoilState(isFull)
  const [isUser, setUser] = useRecoilState(isUserState)
  const [isExpand, setExpand] = useRecoilState(isExpandState)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
  const restrictedRoutes = ['/accounts','/admins','/attendants','/dashboard','/services','/settings','/adverts','/counters','/recorder','/payment','/clinic','/doctor_patient']
  const adminRoutes = ['/admins','/attendants','/counters','/dashboard','/services','/settings','/adverts','/','/login','/queue_add','/clinic']
  const medRoutes = ['/recorder','/','/login','/queue_add','/']
  const doctorRoutes = ['/doctor_patient','/','/login','/queue_add','/']
  const nurseRoutes = ['/clinic','/','/login','/queue_add','/']
  const accountRoutes = ['/accounts','/','/login','/queue_add']
  const [error,setError] = useRecoilState(errorState)
  const [isError, setIsError] = useState(false)
  const [language, setLanguage] = useRecoilState(LanguageState)

  useEffect(() => {
    checkAuth()
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);
    const intervalId = setInterval(()=> {
      if(language==="English"){
        setLanguage("Swahili")
      }else{
        setLanguage("English")
      }
    },5000)

    return () => {
      clearInterval(intervalId);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
}, [error]);

const checkAuth = () => {
    const token:any = localStorage.getItem("token")
    if (isTokenExpired(token)) {
        localStorage.removeItem('token')
        validRoutes()
    } else {
        const decoded:any = jwtDecode(token)
        getAdmin(decoded.phone)
        validRoutes()
    }
}

const validRoutes = () => {
  const path = router.pathname
  const user = localStorage.getItem('user_role')
  const defaultPage = localStorage.getItem('page')
   if(!currentUser){
  //if(Object.keys(currentUser).length < 1){
    if(defaultPage){
      router.push(`${defaultPage}`)
    }else{
      router.push(`/`)
    }
  }else{
    if(restrictedRoutes.includes(path)){
      if(user==="admin" && !adminRoutes.includes(path)){
        if(defaultPage){
          router.push(defaultPage)
        }else{
          router.push('/')
        }
      }else if(user ==="medical_recorder" && !medRoutes.includes(path)){
        router.push('/recorder')
      }else if(user ==="cashier" && !accountRoutes.includes(path)){
        router.push('/accounts')
      }else if(user ==="nurse" && !nurseRoutes.includes(path)){
        router.push('/clinic')
      }else if(user ==="doctor" && !doctorRoutes.includes(path)){
        router.push('/doctor_patient')
      }else{
        router.push(path)
      }
    }else{
      router.push(path)
      // if(defaultPage){
      //   router.push(`${defaultPage}`)
      // }else{
      //   router.push(`/`)
      // }
    }
  }
}
const getAdmin = (phone: string) => {
  const user = localStorage.getItem('user_service')
  axios.get('http://localhost:5000/users/get_user',{params: {phone}}).then((data) => {
      setCurrentUser(data.data)
      if(user){
        localStorage.removeItem('user_service')
        localStorage.removeItem('user_role')
        localStorage.setItem("user_service",data.data.service)
        localStorage.setItem("user_role",data.data.role)
      }else{
        localStorage.setItem("user_service",data.data.service)
        localStorage.setItem("user_role",data.data.role)
      }
  }).catch((error) => {
      if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`)
          alert(error.response.data.error);
      } else {
          console.log(`there is an error message ${error.message}`)
          alert(error.message);
      }
  })
}
  function isTokenExpired(token: any) {
    if (!token) {
        localStorage.removeItem('token')
        return true; // Consider expired if no token is present
    }else{
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Consider expired on decoding error
    }
    }
}

const clearError = () => {
  setError("")
  setIsError(false)
}
  return (
    <div className={styles.layout}>
      {
        isUser && (<div className={styles.profile_page}>
          <Profile/>
        </div>)
      }
      <div className={cx(styles.side,full && styles.full)}>
        <SideBar/>
      </div>
      <div className={cx(styles.children,full && styles.full)}>
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
      <div className={styles.expand}>
      {
        isExpand && (<div className={styles.absa}>
          <div className={styles.absa_icons}>
            <div className={styles.absa_icon} onClick={()=> setFull(!full)}>
              {
                full
                ? <GoZoomOut className={styles.absa_icon_}/>
                : <GoZoomIn className={styles.absa_icon_}/>
              }
            </div>
            <div className={styles.absa_icon} onClick={()=> setUser(!isUser)}>
             {
              isUser 
              ?<GoPerson className={styles.absa_icon_}/>
              : <GoPersonAdd className={styles.absa_icon_}/>
             }
            </div>
          </div>
        </div>)
      }
      <div className={styles.absa_default} onClick={()=> setExpand(!isExpand)}>
        {
          isExpand
          ? <FaMinus className={styles.expa_icon}/>
          : <MdOutlineAdd className={styles.expa_icon}/>
        }
      </div>
      </div>
    </div>
  )
}
