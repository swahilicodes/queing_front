import React, { useState } from 'react'
import styles from './profile.module.scss'
import { useRecoilState, useRecoilValue } from 'recoil'
import currentUserState from '@/store/atoms/currentUser'
import { MdOutlineClear } from 'react-icons/md'
import { FiChevronDown } from 'react-icons/fi'
import { GoChevronUp } from 'react-icons/go'
import isUserState from '@/store/atoms/isUser'
import bcrypt from 'bcryptjs'
import { HiOutlineRefresh } from 'react-icons/hi'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Profile() {
  const currentUser:any = useRecoilValue(currentUserState)
  const [isUser, setUser] = useRecoilState(isUserState)
  const [isEditable, setEditable] = useState(false)
  const [oldPass,setOldPass] = useState('')
  const [newPass,setNewPass] = useState('')
  const router = useRouter()

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if(isEditable){
        axios.put(`http://192.168.30.245:5000/users/edit_user/${currentUser.id}`,{oldPass,newPass}).then((data)=> {
            setEditable(false)
            router.reload()
        }).catch((error)=> {
            if (error.response && error.response.status === 400) {
                console.log(`there is an error ${error.message}`)
                alert(error.response.data.error);
            } else {
                console.log(`there is an error message ${error.message}`)
                alert(error.message);
            }
        })
    }else{
        setEditable(!isEditable)
    }
  }

  const clearFields = () => {
    setOldPass('')
    setNewPass('')
    setEditable(false)
  }
  return (
    <div className={styles.profile}>
        <div className={styles.wrap}>
            <div className={styles.profile_top}>
                <div className={styles.profile_one}></div>
                <div className={styles.profile_two}>
                    <div className={styles.image}>
                        <img src="/place_holder.png" alt="" />
                    </div>
                </div>
            </div>
            <div className={styles.profile_content}>
                <div className={styles.items}>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>name</label>
                            <div>{currentUser.name??"N/A"}</div>
                        </div>
                        <div className={styles.action}>edit</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>phone</label>
                            <div>{currentUser.phone??"N/A"}</div>
                        </div>
                        <div className={styles.action}>edit</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>service</label>
                            <div>{currentUser.service??"N/A"}</div>
                        </div>
                        <div className={styles.action}>edit</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>counter</label>
                            <div>{currentUser.counter??"N/A"}</div>
                        </div>
                        <div className={styles.action}>edit</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>role</label>
                            <div>{currentUser.role??"N/A"}</div>
                        </div>
                        <div className={styles.action}>edit</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.data}>
                            <label>password</label>
                            {
                                isEditable 
                                ? <div className={styles.inputs}>
                                    <form onSubmit={changePassword}>
                                    <input 
                                    type="text" 
                                    placeholder='old password'
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    required
                                   />
                                    <input 
                                    type="text" 
                                    placeholder='new password'
                                    value={newPass}
                                    required
                                    onChange={e => setNewPass(e.target.value)}
                                   />
                                    </form>
                                </div>
                                : <div className={styles.password}>{currentUser.password??"N/A"}</div>
                            }
                        </div>
                        <div className={styles.edit_action}>
                            <button type='submit' onClick={changePassword}>{isEditable?"submit":"edit"}</button>
                            {/* <div className={styles.btn_item} onClick={()=> changePassword()} type="submit">{isEditable?"submit":"edit"}</div> */}
                            <div className={styles.btn_item} onClick={()=> setEditable(true)}>Sign Out</div>
                            <div className={styles.btn_item} onClick={()=> clearFields()}><HiOutlineRefresh/></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.close} onClick={()=> setUser(false)}>
                <div className={styles.profile_close}>
                <GoChevronUp className={styles.close_icon} size={30}/>
                </div>
            </div>
        </div>
    </div>
  )
}
