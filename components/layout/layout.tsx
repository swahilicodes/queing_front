import isFull from '@/store/atoms/isFull'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
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
import isMenuState from '@/store/atoms/isMenu'
import Menu from '../menu/menu'
import Chakula_Menu from '../menu/menu'
import deviceState from '@/store/atoms/device'
import { Url } from 'next/dist/shared/lib/router/router'
import useAuth from '@/custom_hooks/useAuth'
import LoginModal from '../login_modal/login_modal'


export default function Layout({children}:any) {
  const [full, setFull] = useRecoilState(isFull)
  const [isMenu, setMenu] = useRecoilState(isMenuState)
  const [isUser, setUser] = useRecoilState(isUserState)
  const [isExpand, setExpand] = useRecoilState(isExpandState)
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
  const [device, setDeviceState] = useRecoilState(deviceState)
  let page: Url | null
  //const token = localStorage.getItem('token')
  useAuth();

  useEffect(() => {
    //getMac()
    // checkAuth()
    // getMac()
    // const handleStart = () => NProgress.start();
    // const handleStop = () => NProgress.done();
    // router.events.on('routeChangeStart', handleStart);
    // router.events.on('routeChangeComplete', handleStop);
    // router.events.on('routeChangeError', handleStop);

    window.addEventListener('keydown', handleKeyDown);

    // return () => {
    //   router.events.off('routeChangeStart', handleStart);
    //   router.events.off('routeChangeComplete', handleStop);
    //   router.events.off('routeChangeError', handleStop);
    //   window.removeEventListener('keydown', handleKeyDown);
    // };
}, [error,full, isUser,currentUser]);

const handleKeyDown = (event: KeyboardEvent) => {
  console.log('key is ',event.key)
   if(event.key === '@'){
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

// const checkAuth = () => {
//     const token:any = localStorage.getItem("token")
//     if (isTokenExpired(token)) {
//         localStorage.removeItem('token')
//         getMac()
//     } else {
//         const decoded:any = jwtDecode(token)
//         getAdmin(decoded.phone)
//         getMac()
//     }
// }

// const validRoutes = (piga: string) => {
//   const path = router.pathname
//   const defaultPage = localStorage.getItem('page')
//       if(piga){
//           router.push(piga)
//       }else{
//         router.push("/")
//           // if(defaultPage !== null || defaultPage !== ""){
//           //     if(path==="/login"){
//           //         page = path
//           //     }else{
//           //         page = defaultPage
//           //     }
//           // }else{
//           //     page = "/"
//           // }
//       }
//       //router.push(`${page}`)
// }
// const getAdmin = (phone: string) => {
//   const user = localStorage.getItem('user_service')
//   axios.get('http://localhost:5000/users/get_user',{params: {phone}}).then((data) => {
//       setCurrentUser(data.data)
//       if(user){
//         localStorage.removeItem('user_service')
//         localStorage.removeItem('user_role')
//         localStorage.setItem("user_service",data.data.service)
//         localStorage.setItem("user_role",data.data.role)
//       }else{
//         localStorage.setItem("user_service",data.data.service)
//         localStorage.setItem("user_role",data.data.role)
//       }
//   }).catch((error) => {
//       if (error.response && error.response.status === 400) {
//           console.log(`there is an error ${error.message}`)
//           alert(error.response.data.error);
//       } else {
//           console.log(`there is an error message ${error.message}`)
//           alert(error.message);
//       }
//   })
// }
const getMac = () => {
  console.log('getting device id')
  axios.get('http://localhost:5000/network/get_device_id').then((data) => {
      // setDeviceState(data.data)
      // validRoutes(data.data.default_page)
      // console.log(data)
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
//   function isTokenExpired(token: any) {
//     if (!token) {
//         localStorage.removeItem('token')
//         return true; // Consider expired if no token is present
//     }else{
//       try {
//         const decodedToken: any = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
//         return decodedToken.exp < currentTime;
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         return true; // Consider expired on decoding error
//     }
//     }
// }

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
