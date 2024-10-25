// import React from 'react'
// import styles from './side_bar.module.scss'
// import Link from 'next/link'
// import cx from 'classnames'
// import { useRouter } from 'next/router'
// import { GoGitMergeQueue } from 'react-icons/go'
// import { MdOutlineAdminPanelSettings, MdOutlineCountertops, MdOutlineQueuePlayNext, MdOutlineRemoveFromQueue, MdOutlineRoomService } from 'react-icons/md'
// import { FaHandHoldingMedical, FaSignInAlt, FaThList } from 'react-icons/fa'
// import { HiMiniUserGroup } from 'react-icons/hi2'
// import { useRecoilState, useRecoilValue } from 'recoil'
// import currentUserState from '@/store/atoms/currentUser'
// import { FiSettings } from 'react-icons/fi'
// import { FcAdvertising } from 'react-icons/fc'
// import { IoArrowRedoOutline, IoArrowUndoOutline } from 'react-icons/io5'
// import { FaUserDoctor } from 'react-icons/fa6'
// import { RiNurseFill } from 'react-icons/ri'

// export default function SideBar() {
//  const router = useRouter()
//  const [currentUser,setCurrentUser] = useRecoilState<any>(currentUserState)

//  const signOut = () => {
//     localStorage.removeItem('token')
//     setCurrentUser({})
//     router.push('/login')
//  }
//   return (
//     <div className={styles.side_bar}>
//         <div className={styles.logo}>
//             {/* <img src="/wait1.svg" alt="" /> */}
//             <img src="/mnh.png" alt="" />
//             <div className={styles.title}>
//             <h1>MLOGANZILA</h1>
//             <p>Queing System</p>
//             </div>
//         </div>
//         <div className={styles.links}>
//             <ul>
//                <li className={cx(styles.link,router.pathname==="/" && styles.active)}>
//                     <GoGitMergeQueue className={styles.icon}/>
//                     <Link href="/" className={styles.link}>Home</Link>
//                 </li>
//                 <li className={cx(styles.link,router.pathname==="/queue_add" && styles.active)}>
//                     <MdOutlineRemoveFromQueue className={styles.icon}/>
//                     <Link href="/queue_add" className={styles.link}>Queue</Link>
//                 </li>
//                 {
//                     currentUser.role==="admin" && (<li className={cx(styles.link,router.pathname==="/dashboard" && styles.active)}>
//                     <FaThList className={styles.icon}/>
//                     <Link href="/dashboard" className={styles.link}>Dashboard</Link>
//                 </li>)
//                 }
//                 {
//                     currentUser.role === "admin" && (<li className={cx(styles.link,router.pathname==="/services" && styles.active)}>
//                     <MdOutlineRoomService className={styles.icon}/>
//                     <Link href="/services" className={styles.link}>Services</Link>
//                 </li>)
//                 }
//                 {
//                     currentUser.role === "admin" && (<li className={cx(styles.link,router.pathname==="/counters" && styles.active)}>
//                     <MdOutlineCountertops className={styles.icon}/>
//                     <Link href="/counters" className={styles.link}>Counters</Link>
//                 </li>)
//                 }
//                 {
//                     currentUser.role === undefined && (<li className={cx(styles.link,router.pathname==="/login" && styles.active)}>
//                     <IoArrowRedoOutline className={styles.icon}/>
//                     <Link href="/login" className={styles.link}>Login</Link>
//                 </li>)
//                 }
//                 {
//                     currentUser.role !== undefined && (
//                         <li onClick={signOut} className={cx(styles.link,router.pathname==="/login" && styles.active)}>
//                             <IoArrowUndoOutline className={styles.icon}/>
//                             <div className={styles.link}>Sign Out</div>
//                         </li>
//                     )
//                 }
//                 {
//                     (currentUser !== undefined && currentUser.role === "admin") && (<li className={cx(styles.link,router.pathname==="/settings" && styles.active)}>
//                     <FiSettings className={styles.icon}/>
//                     <Link href="/settings" className={styles.link}>Settings</Link>
//                 </li>)
//                 }
//                 {
//                     (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/admins" && styles.active)}>
//                     <MdOutlineAdminPanelSettings className={styles.icon}/>
//                     <Link href="/admins" className={styles.link}>Admins</Link>
//                 </li>)
//                 }
//                 {
//                     (currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/adverts" && styles.active)}>
//                     <FcAdvertising className={styles.icon}/>
//                     <Link href="/adverts" className={styles.link}>Adverts</Link>
//                 </li>)
//                 }
//                 {
//                     (currentUser !== undefined && currentUser.role === 'admin' ) && (<li className={cx(styles.link,router.pathname==="/attendants" && styles.active)}>
//                     <FaUserDoctor className={styles.icon}/>
//                     <Link href="/attendants" className={styles.link}>Attendants</Link>
//                 </li>)
//                 }
//                 {
//                   ((currentUser !== undefined && currentUser.role === 'medical_recorder') || currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/meds" && styles.active)}>
//                   <RiNurseFill className={styles.icon}/>
//                   <Link href="/recorder" className={styles.link}>Meds</Link>
//               </li>)  
//                 }
//                 {
//                   (currentUser !== undefined && currentUser.role === 'accountant' || currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/accounts" && styles.active)}>
//                     <RiNurseFill className={styles.icon}/>
//                     <Link href="/accounts" className={styles.link}>Accounts</Link>
//                 </li>)  
//                 }
//                 {
//                 (currentUser !== undefined && currentUser.role === 'cashier' || currentUser !== undefined && currentUser.role === 'admin') && (<li className={cx(styles.link,router.pathname==="/payment" && styles.active)}>
//                     <RiNurseFill className={styles.icon}/>
//                     <Link href="/payment" className={styles.link}>Payment</Link>
//                 </li>)
//                 }
//                 {
//                     (currentUser !== undefined && (currentUser.role === 'nurse' || currentUser.role === 'admin')) && (<li className={cx(styles.link,router.pathname==="/clinic" && styles.active)}>
//                     <RiNurseFill className={styles.icon}/>
//                     <Link href="/clinic" className={styles.link}>Clinic</Link>
//                 </li>)
//                 }
//                 {
//                     (currentUser !== undefined && (currentUser.role === "doctor" || currentUser.role === 'admin')) && (<li className={cx(styles.link,router.pathname==="/doctor_patient" && styles.active)}>
//                     <RiNurseFill className={styles.icon}/>
//                     <Link href="/doctor_patient" className={styles.link}>Doc Patient</Link>
//                 </li>)
//                 }
//             </ul>
//         </div>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import styles from './sider.module.scss'
import Link from 'next/link'
import { AiOutlineHome } from 'react-icons/ai'
import cx from 'classnames'
import { FaChessQueen } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import currentUserState from '@/store/atoms/currentUser'
import { useRouter } from 'next/router'
import { IoArrowUndoOutline } from 'react-icons/io5'

function SideBar() {
  const [active, setActive] = useState(false)
  const [currentIndex, setIndex] = useState(0)
  const [currentUser,setCurrentUser] = useRecoilState<any>(currentUserState)
  const router = useRouter()
  const [allowed, setAllowed] = useState<any>([])
  const [restricted, setRestricted] = useState<any>([])
  const routes = [
    {
        id: 0,
        path: "/",
        name: "Home",
        icon: "fa fa-home",
        users: ["admin","doctor","nurse","accountant"]
    },
    {
        id: 1,
        path: "/queue_add",
        name: "Queue",
        icon: "fa fa-users",
        users: ["admin","doctor","nurse","accountant"]
    },
    {
        id: 2,
        path: "/admins",
        name: "Admins",
        icon: "fa fa-lock",
        users: ["admin"]
    },
    {
        id: 3,
        path: "/accounts",
        name: "Cashier",
        icon: "fa fa-address-book-o",
        users: ["accountant","admin"]
    },
    {
        id: 4,
        path: "/adverts",
        name: "Adverts",
        icon: "fa fa-commenting-o",
        users: ["admin"]
    },
    {
        id: 5,
        path: "/attendants",
        name: "Attendants",
        icon: "fa fa-child",
        users: ["admin"]
    },
    {
        id: 6,
        path: "/clinic",
        name: "Clinic",
        icon: "fa fa-user-md",
        users: ["doctor","admin"]
    },
    {
        id: 7,
        path: "/clinics",
        name: "Clinics",
        icon: "fa fa-hospital-o",
        users: ["admin"]
    },
    {
        id: 8,
        path: "/counters",
        name: "Counters",
        icon: "fa fa-windows",
        users: ["admin"]
    },
    {
        id: 9,
        path: "/dashboard",
        name: "Dashboard",
        icon: "fa fa-tachometer",
        users: ["admin"]
    },
    {
        id: 10,
        path: "/doctor_patient",
        name: "Consultation",
        icon: "fa fa-volume-control-phone",
        users: ["admin","doctor"]
    },
    {
        id: 11,
        path: "/doktas",
        name: "Doctors",
        icon: "fa fa-user-md",
        users: ["admin"]
    },
    {
        id: 12,
        path: "/login",
        name: "Login",
        icon: "fa fa-plug",
        users: ["admin","doctor","nurse","accountant"]
    },
    {
        id: 13,
        path: "/recorder",
        name: "Medical Records",
        icon: "fa fa-registered",
        users: ["admin","medical_recorder"]
    },
    {
        id: 14,
        path: "/rooms",
        name: "Rooms",
        icon: "fa fa-braille",
        users: ["admin"]
    },
    {
        id: 15,
        path: "/settings",
        name: "Settings",
        icon: "fa fa-cog",
        users: ["admin"]
    },
  ]

  useEffect(()=> {
    if(Object.keys(currentUser).length>0){
        const right = routes.filter((user)=> user.users.includes(currentUser.role))
        setAllowed(right)
    }
    const restrict = routes.filter((user)=> (user.path==="/" || user.path ==="/queue_add" || user.path === "/login"))
    setRestricted(restrict)
  },[currentUser])

   const signOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({})
    router.push('/login')
 }
  return (
    <div className={styles.sider}>
        {
            (Object.keys(currentUser).length>0 &&  allowed.length > 0)  && (
                <div className={styles.links}>
                    {
            allowed.map((item:any,index:number)=> (
                <Link className={cx(styles.link,item.path==="/login" && styles.remove)} href={item.path} onMouseEnter={()=> setIndex(index+1)} onMouseLeave={()=> setIndex(0)}>
                <div className={styles.icon}>
                    <i className={item.icon} aria-hidden="true"/>
                </div>
                <div className={cx(styles.title,index+1 ===currentIndex && styles.active)}>{item.name}</div>
                </Link> 
            ))
        }
                </div>
            )
        }
         {
            currentUser.role !== undefined && (
                <div className={cx(styles.link)}  onMouseEnter={()=> setIndex(100)} onMouseLeave={()=> setIndex(0)} onClick={signOut}>
                <div className={styles.icon}>
                    <i className="fa fa-power-off" aria-hidden="true"/>
                </div>
                <div className={cx(styles.title,100 ===currentIndex && styles.active)}>Sign Out</div>
                </div>
            )
        }
        {
            (currentUser.role === undefined && restricted.length > 0) && (
              <div className="links">
                {
                    restricted.map((item:any,index:number)=> (
                        <Link className={cx(styles.link)} href={item.path} onMouseEnter={()=> setIndex(index+1)} onMouseLeave={()=> setIndex(0)}>
                <div className={styles.icon}>
                    <i className={item.icon} aria-hidden="true"/>
                </div>
                <div className={cx(styles.title,index+1 ===currentIndex && styles.active)}>{item.name}</div>
                </Link>
                    ))
                }
              </div> 
            )
        }
    </div>
  )
}

export default SideBar
