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
  const [restricted, setRestricted] = useState<any>([]);
  const setMenu = useSetRecoilState(isMenuState)
  const routes = [
    {
      id: 0,
      path: "/",
      name: "Home",
      icon: "fa fa-home",
      users: ["admin", "doctor", "nurse", "accountant"],
    },
    {
      id: 1,
      path: "/queue_add",
      name: "Queue",
      icon: "fa fa-users",
      users: ["admin", "doctor", "nurse", "accountant"],
    },
    {
      id: 2,
      path: "/admins",
      name: "Admins",
      icon: "fa fa-lock",
      users: ["admin"],
    },
    {
      id: 3,
      path: "/accounts",
      name: "Cashier",
      icon: "fa fa-address-book-o",
      users: ["accountant", "admin"],
    },
    {
      id: 4,
      path: "/adverts",
      name: "Adverts",
      icon: "fa fa-commenting-o",
      users: ["admin"],
    },
    {
      id: 5,
      path: "/attendants",
      name: "Attendants",
      icon: "fa fa-child",
      users: ["admin"],
    },
    {
      id: 6,
      path: "/clinic",
      name: "Clinic",
      icon: "fa fa-user-md",
      users: ["nurse", "admin"],
    },
    {
      id: 7,
      path: "/clinics",
      name: "Clinics",
      icon: "fa fa-hospital-o",
      users: ["admin"],
    },
    {
      id: 8,
      path: "/counters",
      name: "Counters",
      icon: "fa fa-windows",
      users: ["admin"],
    },
    {
      id: 9,
      path: "/dashboard",
      name: "Dashboard",
      icon: "fa fa-tachometer",
      users: ["admin"],
    },
    {
      id: 10,
      path: "/doctor_patient",
      name: "Consultation",
      icon: "fa fa-volume-control-phone",
      users: ["admin", "doctor"],
    },
    {
      id: 16,
      path: `${router.pathname}`,
      name: "Sign Out",
      icon: "fa fa-power-off",
      users: ["admin", "doctor", "nurse", "accountant"],
    },
    {
      id: 11,
      path: "/doktas",
      name: "Doctors",
      icon: "fa fa-user-md",
      users: ["admin"],
    },
    {
      id: 12,
      path: "/login",
      name: "Login",
      icon: "fa fa-plug",
      users: ["admin", "doctor", "nurse", "accountant"],
    },
    {
      id: 13,
      path: "/recorder",
      name: "Medical Records",
      icon: "fa fa-registered",
      users: ["admin", "medical_recorder"],
    },
    {
      id: 14,
      path: "/rooms",
      name: "Rooms",
      icon: "fa fa-braille",
      users: ["admin"],
    },
    {
      id: 15,
      path: "/settings",
      name: "Settings",
      icon: "fa fa-cog",
      users: ["admin"],
    },
  ];

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      const right = routes.filter((user) =>
        user.users.includes(currentUser.role)
      );
      setAllowed(right);
    }
    const restrict = routes.filter(
      (user) =>
        user.path === "/" ||
        user.path === "/queue_add" ||
        user.path === "/login"
    );
    setRestricted(restrict);
  }, [currentUser]);

  const signOut = () => {
    localStorage.removeItem("token");
    setCurrentUser({});
    setMenu(false)
    router.reload()
  };
  return (
    <div className={styles.menu_bottom}>
      {( currentUser !== undefined  && allowed.length > 0) && (
        <div className={styles.links}>
          {allowed.map((item: any, index: number) => (
            <Link
            key={index}
              className={cx(
                styles.link,
                index + 1 === currentIndex && styles.active,
                item.path === "/login" && styles.remove
              )}
              onClick={()=> item.id===16 && signOut()}
              href={item.path}
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
      {/* {(currentUser !== undefined  && restricted.length > 0) && (
        <div className={styles.links}>
          {restricted.map((item: any, index: number) => (
            <Link
              key={index}
              className={cx(styles.link)}
              href={item.path}
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
      )} */}
    </div>
  );
}

export default Chakula_Menu;
