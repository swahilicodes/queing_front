import React, { useEffect, useState } from "react";
import styles from "./menu.module.scss";
import currentUserState from "@/store/atoms/currentUser";
import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";
import { useRecoilState, useSetRecoilState } from "recoil";
import isMenuState from "@/store/atoms/isMenu";

function Chakula_Menu() {
  const [currentIndex, setIndex] = useState(0);
  const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState);
  const router = useRouter();
  const [allowed, setAllowed] = useState<any>([]);
  const setMenu = useSetRecoilState(isMenuState);

  const routes = [
    { id: 0, path: "/", name: "Home", icon: "fa fa-home" },
    { id: 1, path: "/print", name: "Queue", icon: "fa fa-users" },
    { id: 2, path: "/admins", name: "Admins", icon: "fa fa-lock" },
    { id: 3, path: "/accounts", name: "Cashier", icon: "fa fa-address-book-o" },
    { id: 4, path: "/adverts", name: "Adverts", icon: "fa fa-commenting-o" },
    { id: 5, path: "/attendants", name: "Attendants", icon: "fa fa-child" },
    { id: 6, path: "/clinic", name: "Clinic", icon: "fa fa-user-md" },
    { id: 7, path: "/clinics", name: "Clinics", icon: "fa fa-hospital-o" },
    { id: 8, path: "/counters", name: "Counters", icon: "fa fa-windows" },
    { id: 9, path: "/doctor_patient", name: "Consultation", icon: "fa fa-volume-control-phone" },
    { id: 10, path: "/doktas", name: "Doctors", icon: "fa fa-user-md" },
    { id: 11, path: "/recorder", name: "Medical Records", icon: "fa fa-registered" },
    { id: 12, path: "/rooms", name: "Rooms", icon: "fa fa-braille" },
    { id: 13, path: "/accounts_queue", name: "Cashier Queue", icon: "fa fa-money" },
    { id: 14, path: "/speaker", name: "Speaker", icon: "fa fa-volume-up" },
    { id: 15, path: "/analytics", name: "Analytics", icon: "fa fa-line-chart" },
    { id: 16, path: "/devices", name: "Devices", icon: "fa fa-desktop" },
    { id: 17, path: "/clinic_queue", name: "Clinic Queue", icon: "fa fa-desktop" },
    { id: 18, path: "/videos", name: "Videos", icon: "fa fa-desktop" },
    { id: 19, path: "/signout", name: "Sign Out", icon: "fa fa-power-off" }, // using /signout for logout action
  ];

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      let right: any = [];
  
      switch (currentUser.role) {
        case "admin":
          right = routes;
          break;
        case "medical_recorder":
          right = routes.filter(r =>
            ["/recorder", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
          );
          break;
        case "accounts":
          right = routes.filter(r =>
            ["/accounts", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
          );
          break;
        case "nurse":
          right = routes.filter(r =>
            ["/clinic", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
          );
          break;
        case "doctor":
          right = routes.filter(r =>
            ["/doctor_patient", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
          );
          break;
        case "pro":
          right = routes.filter(r =>
            ["/videos", "/", "/accounts_queue", "/clinic_queue", "/adverts"].includes(r.path)
          );
          break;
        default:
          right = [];
      }
  
      // Ensure Sign Out is always included
      const signOutRoute = routes.find(r => r.path === "/signout");
      if (signOutRoute && !right.includes(signOutRoute)) {
        right.push(signOutRoute);
      }
  
      setAllowed(right);
    }
  }, [currentUser]);
  
  // useEffect(() => {
  //   if (currentUser && Object.keys(currentUser).length > 0) {
  //     let right: any = [];

  //     switch (currentUser.role) {
  //       case "admin":
  //         right = routes;
  //         break;
  //       case "meds":
  //         right = routes.filter(r =>
  //           ["/recorder", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
  //         );
  //         break;
  //       case "accounts":
  //         right = routes.filter(r =>
  //           ["/accounts", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
  //         );
  //         break;
  //       case "nurse":
  //         right = routes.filter(r =>
  //           ["/clinic", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
  //         );
  //         break;
  //       case "doctor":
  //         right = routes.filter(r =>
  //           ["/doctor_patient", "/", "/accounts_queue", "/clinic_queue"].includes(r.path)
  //         );
  //         break;
  //       case "pro":
  //         right = routes.filter(r =>
  //           ["/videos", "/", "/accounts_queue", "/clinic_queue", "/adverts"].includes(r.path)
  //         );
  //         break;
  //       default:
  //         right = [];
  //     }

  //     setAllowed(right);
  //   }
  // }, [currentUser]);

  const signOut = () => {
    localStorage.removeItem("token");
    setCurrentUser({});
    setMenu(false);
    router.reload();
  };

  return (
    <div className={styles.menu_bottom}>
      {/* <div className="menu">this is menu</div> */}
      {currentUser && allowed.length > 0 && (
        <div className={styles.links}>
          {allowed.map((item: any, index: number) => (
            <Link
              key={item.id}
              className={cx(
                styles.link,
                (index + 1 === currentIndex || item.path === router.pathname) && styles.active,
                item.path === "/login" && styles.remove
              )}
              href={item.path === "/signout" ? "#" : item.path}
              onClick={() => item.path === "/signout" && signOut()}
              onMouseEnter={() => setIndex(index + 1)}
              onMouseLeave={() => setIndex(0)}
            >
              <div className={styles.icon}>
                <i className={item.icon} aria-hidden="true" />
              </div>
              <div
                className={cx(
                  styles.title,
                  index + 1 === currentIndex && styles.active
                )}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chakula_Menu;
