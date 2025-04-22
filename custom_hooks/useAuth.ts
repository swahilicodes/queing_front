import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSetRecoilState } from 'recoil';
import currentUserState from '@/store/atoms/currentUser';
import deviceState from '@/store/atoms/device';
import { getLocalDeviceIP } from './deviceInfo';
import messageState from '@/store/atoms/message';

const useAuth = () => {
  const router = useRouter();
  const setCurrentUser = useSetRecoilState(currentUserState)
  const setDeviceState =  useSetRecoilState(deviceState)
  const path = router.pathname
  const [ipAddress, setIpAddress] = useState(null);
  const setMessage = useSetRecoilState(messageState)
  const id = getLocalDeviceIP()

  useEffect(() => {
    checkAuth();
  }, []);


  const checkAuth = () => {
    const token:any = localStorage.getItem("token")
    if (isTokenExpired(token)) {
        localStorage.removeItem('token')
        getMac()
    } else {
        const decoded:any = jwtDecode(token)
        getAdmin(decoded.phone)
        if(decoded.role==="admin"){
            router.replace(router.pathname)
        }else{
            if(decoded.role==="medical_recorder"){
                router.replace('/recorder')
            }else if(decoded.role==="accountant"){
                router.replace("/accounts")
            }else if(decoded.role==="nurse"){
                router.replace("/clinic")
            }else if(decoded.role==="doctor"){
                router.replace("/doctor_patient")
            }
        }
    }
}

const validRoutes = (piga: string) => {
      if(piga){
        router.replace(piga)
      }else{
        router.replace("/")
          // if(defaultPage !== null || defaultPage !== ""){
          //     if(path==="/login"){
          //         page = path
          //     }else{
          //         page = defaultPage
          //     }
          // }else{
          //     page = "/"
          // }
      }
      //router.push(`${page}`)
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
        setMessage({...onmessage,title:error.response.data.error,category: "error"})
        setTimeout(()=> {
          setMessage({...onmessage,title:"",category: ""})
        },3000)
      } else {
        setMessage({...onmessage,title:error.message,category: "error"})
        setTimeout(()=> {
          setMessage({...onmessage,title:"",category: ""})
        },3000)
      }
  })
}
const getMac = async () => {
  if(typeof window !== "undefined"){
    if(id){
      await axios.post("http://localhost:5000/network/create_update",{macAddress: `${localStorage.getItem('unique_id')}`,deviceName:"Null",deviceModel:id.type,manufacturer: "Null"}).then((dita)=> {
        setDeviceState(dita.data)
        validRoutes(dita.data.default_page)
      }).catch((error)=> {
        console.log(error)
      })
    }
  }
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
};

export default useAuth;
