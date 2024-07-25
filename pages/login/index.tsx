import React, { useState } from 'react'
import styles from './login.module.scss'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import errorState from '@/store/atoms/error'

export default function Login() {
 const [phone, setPhone] = useState('')
 const [pass, setPass] = useState('')
 const router = useRouter()
 const [error,setError] = useRecoilState(errorState)

 const login = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/users/login",{phone,password:pass}).then((data:any)=> {
        localStorage.setItem("token",data.data)
        router.push("/")
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            setError(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            setError(error.message);
        }
    })
 }
  return (
    <div className={styles.login}>
        <form onSubmit={login}>
        <div className={styles.add_item}>
        <label htmlFor="name">Enter name</label>
        <input 
        type="text" 
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder='phone*'
        id="phone" 
        name="phone"
        />
        </div>
        <div className={styles.add_item}>
        <label htmlFor="pass">Enter Password</label>
        <input 
        type="password" 
        value={pass}
        onChange={e => setPass(e.target.value)}
        placeholder='pass*'
        id="pass" 
        name="password"
        />
        </div>
        <button type='submit'>submit</button>
        </form>
    </div>
  )
}
