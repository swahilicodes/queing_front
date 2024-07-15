import isFull from '@/store/atoms/isFull'
import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styles from './layout.module.scss'
import SideBar from '../side_bar/side_bar'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'
import currentUserState from '@/store/atoms/currentUser'
import cx from 'classnames'
import { TiZoomInOutline, TiZoomOut } from 'react-icons/ti'

export default function Layout({children}:any) {
  const [full, setFull] = useRecoilState(isFull)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  useEffect(() => {
    checkAuth()
}, []);

const checkAuth = () => {
    const token:any = localStorage.getItem("token")
    if (isTokenExpired(token)) {
        router.push('/login')
    } else {
        const decoded:any = jwtDecode(token)
        getAdmin(decoded.phone)
        if(router.pathname !== '/login'){
            router.push(router.pathname)
        }else{
            router.push('/')
        }
    }
}
const getAdmin = (phone: string) => {
  axios.get('http://localhost:5000/users/get_user',{params: {phone}}).then((data) => {
      setCurrentUser(data.data)
      console.log(currentUser)
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
      console.log('no token')
        return true; // Consider expired if no token is present
    }else{
      console.log('there is token',token)
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
  return (
    <div className={styles.layout}>
      <div className={cx(styles.side,full && styles.full)}>
        <SideBar/>
      </div>
      <div className={cx(styles.children,full && styles.full)}>{children}</div>
      <div className={styles.full_button} onClick={()=> setFull(!full)}>{full?<TiZoomOut className={styles.icon} size={25}/>:<TiZoomInOutline className={styles.icon} size={25}/>}</div>
    </div>
  )
}
