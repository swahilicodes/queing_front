import React, { useEffect } from 'react';
import styles from './barOne.module.scss';
import cx from 'classnames'
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import messageState from '@/store/atoms/message';

interface DataItem {
  year: number;
  completed: boolean;
  quantity: number;
}

const data: DataItem[] = [
  { year: 2001, completed: true, quantity: 10 },
  { year: 2002, completed: false, quantity: 5 },
  { year: 2003, completed: true, quantity: 300 },
  { year: 2004, completed: false, quantity: 50},
  { year: 2005, completed: true, quantity: 20 },
  { year: 2006, completed: false, quantity: 60},
];
const BarGraphOne: React.FC = () => {
  const setMessage = useSetRecoilState(messageState)
  // Group data by year for rendering
  const groupedData = data.reduce((acc: { [key: number]: DataItem[] }, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = [];
    }
    acc[curr.year].push(curr);
    return acc;
  }, {});

  useEffect(()=> {
    getTicks()
  },[])

  const getTicks = () => {
    axios.get("http://192.168.30.246:5000/analytics/token_analytics")
      .then((data: any) => {
        console.log(data)
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 400) {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
        } else {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
        }
      });
  };

  return (
    <div className={styles.bar_graph}>
      <div className={styles.bars}>
        {Object.keys(groupedData).map((year) => (
          <div className={styles.bar_group} key={year}>
            <div className={styles.year_label}>{year}</div>
            <div className={styles.bar_container}>
              {groupedData[Number(year)].map((entry, index) => (
                <div
                  key={index}
                //   className={`bar ${entry.completed ? 'completed' : 'uncompleted'}`}
                  className={cx(styles.bar, entry.completed?styles.completed:styles.uncompleted)}
                  style={{ height: `${entry.quantity * 3}%` }}
                >
                  {entry.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraphOne;

