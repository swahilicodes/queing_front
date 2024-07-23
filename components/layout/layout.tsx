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
import io from 'socket.io-client';
import Profile from '../profile/profile'
import isUserState from '@/store/atoms/isUser'
import isExpandState from '@/store/atoms/isExpand'
import { MdOutlineAdd } from 'react-icons/md'
import { GoPerson, GoPersonAdd, GoZoomIn, GoZoomOut } from 'react-icons/go'
import { FaMinus } from 'react-icons/fa'

export default function Layout({children}:any) {
  const [full, setFull] = useRecoilState(isFull)
  const [isUser, setUser] = useRecoilState(isUserState)
  const [isExpand, setExpand] = useRecoilState(isExpandState)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const socket = io('http://localhost:5000');

  useEffect(() => {
    checkAuth()
    // validRoutes()
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('data', 'Hello Server');
    });

    socket.on('data', (msg) => {
      console.log('Message from server: ' + msg);
    });

    // return () => {
    //   socket.disconnect();
    // };
}, []);

const checkAuth = () => {
    const token:any = localStorage.getItem("token")
    if (isTokenExpired(token)) {
        // router.push('/login')
    } else {
        const decoded:any = jwtDecode(token)
        getAdmin(decoded.phone)
        // if(router.pathname !== '/login'){
        //     router.push(router.pathname)
        // }else{
        //     router.push('/')
        // }
    }
}

const validRoutes = () => {
  const defaultPage = localStorage.getItem('page')
  if(defaultPage){
    router.push(`${defaultPage}`)
  }else{
    router.push(`/`)
  }
}
const getAdmin = (phone: string) => {
  axios.get('http://localhost:5000/users/get_user',{params: {phone}}).then((data) => {
      setCurrentUser(data.data)
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
      <div className={cx(styles.children,full && styles.full)}>{children}</div>
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
      {/* <div className={styles.full_button} onClick={()=> setFull(!full)}>{full?<TiZoomOut className={styles.icon} size={25}/>:<TiZoomInOutline className={styles.icon} size={25}/>}</div> */}
    </div>
  )
}
