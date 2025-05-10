// import isFull from '@/store/atoms/isFull'
// import React, { useEffect, useState } from 'react'
// import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
// import styles from './layout.module.scss'
// import { useRouter } from 'next/router'
// import currentUserState from '@/store/atoms/currentUser'
// import cx from 'classnames'
// import Profile from '../profile/profile'
// import isUserState from '@/store/atoms/isUser'
// import errorState from '@/store/atoms/error'
// import { BiSolidError } from 'react-icons/bi'
// import 'nprogress/nprogress.css';
// import isMenuState from '@/store/atoms/isMenu'
// import Chakula_Menu from '../menu/menu'
// import useAuth from '@/custom_hooks/useAuth'
// import LoginModal from '../login_modal/login_modal'
// import messageState from '@/store/atoms/message'
// import { getLocalDeviceIP } from '@/custom_hooks/deviceInfo'
// import axios from 'axios'
// import LanguageState from '@/store/atoms/language'


// export default function Layout({children}:any) {
//   const [full, setFull] = useRecoilState(isFull)
//   const [isMenu, setMenu] = useRecoilState(isMenuState)
//   const [isUser, setUser] = useRecoilState(isUserState)
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
//   const restrictedRoutes = ['/accounts','/admins','/attendants','/dashboard','/services','/settings','/adverts','/counters','/recorder','/payment','/clinic','/doctor_patient']
//   const adminRoutes = ['/admins','/attendants','/counters','/dashboard','/services','/settings','/adverts','/','/login','/queue_add','/clinic','/recorder','/accounts']
//   const medRoutes = ['/recorder','/','/login','/queue_add','/']
//   const doctorRoutes = ['/doctor_patient','/','/login','/queue_add','/']
//   const nurseRoutes = ['/clinic','/','/login','/queue_add','/']
//   const accountRoutes = ['/accounts','/','/login','/queue_add']
//   const [error,setError] = useRecoilState(errorState)
//   const [isError, setIsError] = useState(false)
//   const message = useRecoilValue(messageState)
//   const [language,setLanguage] = useRecoilState(LanguageState)
//   useAuth();

//   useEffect(() => {
//     const reloadAtMidnight = () => {
//       const now = new Date();
//       const nextMidnight = new Date();
//       nextMidnight.setHours(24, 0, 0, 0); // Set to the next midnight
//       const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

//       setTimeout(() => {
//         window.location.reload(); // Reload the app
//       }, timeUntilMidnight);
//     };

//     reloadAtMidnight();
//     window.addEventListener('keydown', handleKeyDown);

//     const languageId = setInterval(()=> {
//       if(language==="English"){
//         setLanguage("Swahili")
//       }else{
//         setLanguage("English")
//       }
//     },5000)

//     if(router.pathname === "/" || router.pathname === "/accounts_queue" || router.pathname === "/clinic_queue"){
//     const loadInterval =  setInterval(()=> {
//       router.reload()
//       },3600000)
//       return () => {
//         clearInterval(loadInterval)
//       }
//     }

//     return () => {
//       clearInterval(languageId);
//     };
// }, [error,full, isUser,currentUser,message,language]);

// const handleKeyDown = (event: KeyboardEvent) => {
//    if(event.key === 'p'){
//     setUser((prevFull) => !prevFull);
//   }else if(event.key === "<"){
//     //setMenu((isMenu) => !isMenu)
//     setMenu(true)
//   }else if(event.key === ")"){
//     setMenu(false)
//   }else if(event.key===">"){
//     if(full){
//       localStorage.removeItem('token')
//       setCurrentUser({})
//       router.reload()
//     }else{
//       setFull(true)
//     }
//   }else if(event.key==="/"){
//     setFull(false)
//   }else if(event.key==="@"){
//     setUser(true)
//   }
// };



//   return (
//     <div className={styles.layout}>
//         <div className={cx(styles.message,message.title !=="" && styles.active,message.category==="error" && styles.danger)}>{message.title}</div>
//         {/* <div className={cx(styles.message,message.title.trim()!=="" && styles.active,message.category==="error" && styles.danger)}>{message.title}</div> */}
//       {
//         (isUser && currentUser) && (<div className={styles.profile_page}>
//           <Profile/>
//         </div>)
//       }
//           <div className={cx(styles.menu, isMenu && styles.active)}>
//             <Chakula_Menu/>
//           </div>
//       {
//         full && (
//           <div className={cx(styles.logani)}>
//         <LoginModal/>
//       </div>
//         )
//       }
//       <div className={cx(styles.children)}>
//         {children}
//         {
//         isError && (
//           <div className={styles.error_overlay}>
//             <div className={styles.error_content}>
//               <div className={styles.error_top}>
//                 <BiSolidError className={styles.icon} size={60}/>
//               </div>
//               <div className={styles.error_conta}>
//                 <h1>Ooooh Sorry!</h1>
//                 <p>{error??"there is an error"}</p>
//               </div>
//             </div>
//           </div>
//         )
//       }
//       </div>
//     </div>
//   )
// }


import isFull from '@/store/atoms/isFull'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
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
import LanguageState from '@/store/atoms/language'

export default function Layout({children}: any) {
  const [full, setFull] = useRecoilState(isFull)
  const [isMenu, setMenu] = useRecoilState(isMenuState)
  const [isUser, setUser] = useRecoilState(isUserState)
  const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
  const router = useRouter()

  const [error, setError] = useRecoilState(errorState)
  const [isError, setIsError] = useState(false)
  const message = useRecoilValue(messageState)
  const [language, setLanguage] = useRecoilState(LanguageState)

  useAuth();

  useEffect(() => {
    const reloadAtMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

      setTimeout(() => {
        window.location.reload();
      }, timeUntilMidnight);
    };

    // Initiate reload at midnight
    reloadAtMidnight();

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      if (event.key === 'p') {
        setUser(prev => !prev);
      } else if (event.key === "<") {
        setMenu(true);
      } else if (event.key === ")") {
        setMenu(false);
      } else if (event.key === ">") {
        if (full) {
          localStorage.removeItem('token');
          setCurrentUser({});
          router.reload();
        } else {
          setFull(true);
        }
      } else if (event.key === "/") {
        setFull(false);
      } else if (event.key === "@") {
        setUser(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // const languageSwitcherInterval = setInterval(() => {
    //   setLanguage(prevLanguage => prevLanguage === "English" ? "Swahili" : "English");
    // }, 5000);

    if (router.pathname === "/" || router.pathname === "/accounts_queue" || router.pathname === "/clinic_queue") {
      const loadInterval = setInterval(() => {
        router.reload();
      }, 3600000);

      return () => {
        clearInterval(loadInterval);
      };
    }

    return () => {
      //clearInterval(languageSwitcherInterval);
      window.removeEventListener('keydown', handleKeyDown); // Cleanup keydown listener
    };
  }, [full, isUser, currentUser, message, language, router.pathname]);

  return (
    <div className={styles.layout}>
      <div className={cx(styles.message, message.title !== "" && styles.active, message.category === "error" && styles.danger)}>
        {message.title}
      </div>

      {(isUser && currentUser) && (
        <div className={styles.profile_page}>
          <Profile />
        </div>
      )}

      <div className={cx(styles.menu, isMenu && styles.active)}>
        <Chakula_Menu />
      </div>

      {full && (
        <div className={cx(styles.logani)}>
          <LoginModal />
        </div>
      )}

      <div className={cx(styles.children)}>
        {children}
        {isError && (
          <div className={styles.error_overlay}>
            <div className={styles.error_content}>
              <div className={styles.error_top}>
                <BiSolidError className={styles.icon} size={60} />
              </div>
              <div className={styles.error_conta}>
                <h1>Ooooh Sorry!</h1>
                <p>{error ?? "there is an error"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

