// import messageState from '@/store/atoms/message';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { useSetRecoilState } from 'recoil';

// function ClinicCounter() {
// const setMessage = useSetRecoilState(messageState)
// const [services, setServices] = useState([]);
// const device_id = localStorage.getItem('unique_id')

// useEffect(()=> {
//  getAttendants()
// },[services])

// const getAttendants = () => {
//     axios
//       .get("http://192.168.30.246:5005/network/get_all_devices")
//       .then((data) => {
//         setServices(data.data);
//         console.log(data.data)
//       })
//       .catch((error: any) => {
//         if (error.response && error.response.status === 400) {
//           console.log(`there is an error ${error.message}`);
//           setMessage({...onmessage,title:error.response.data.error,category: "error"})
//             setTimeout(()=> {
//                 setMessage({...onmessage,title:"",category: ""})  
//             },5000)
//         } else {
//           console.log(`there is an error message ${error.message}`);
//           setMessage({...onmessage,title:error.message,category: "error"})
//             setTimeout(()=> {
//                 setMessage({...onmessage,title:"",category: ""})  
//             },5000)
//         }
//       });
//   };

//   const displayCounter = () => {
//     const devi = services.find((item:any)=> item.macAddress===device_id)
//     if(devi){
//         return devi
//     }else{
//         return "N/A"
//     }
//   }
//   return (
//     <div>
//       {displayCounter()}
//     </div>
//   )
// }

// export default ClinicCounter
import messageState from '@/store/atoms/message';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

function ClinicCounter() {
  const setMessage = useSetRecoilState(messageState);
  const [services, setServices] = useState([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('unique_id');
      setDeviceId(id);
    }
  }, []);

  useEffect(() => {
    getAttendants();
  }, []);

  const getAttendants = () => {
    axios
      .get("http://192.168.30.246:5005/network/get_all_devices")
      .then((data) => {
        setServices(data.data);
        console.log(data.data);
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          setMessage({ title: error.response.data.error, category: "error" });
        } else {
          console.log(`there is an error message ${error.message}`);
          setMessage({ title: error.message, category: "error" });
        }
        setTimeout(() => {
          setMessage({ title: "", category: "" });
        }, 5000);
      });
  };

  const displayCounter = () => {
    const devi:any = services.find((item: any) => item.macAddress === deviceId);
    return devi ? devi.window : "N/A";
  };

  return <div>{displayCounter()}</div>;
}

export default ClinicCounter;
