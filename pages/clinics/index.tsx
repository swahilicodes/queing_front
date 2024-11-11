import axios from 'axios';
import { useEffect } from 'react';

const Clinics = () => {

  useEffect(() => {
    getClinics()
    // jeevaClinics()
  }, []);

  // const jeevaClinics = () => {
  //   axios.get("http://localhost:5000/clinic/jeeva_clinics").then((data)=> {
  //       if(data.status === 200){
  //           data.data.data.forEach((item) => {
  //               console.log(item)
  //               setInterval(()=> {
  //                   if(clinics.length> 0){
  //                       if(!clinics.includes(item.clinicicode)){
  //                           axios.post("http://localhost:5000/clinic/create_clinic",{cliniciname: item.clinicname,clinicicode: item.clinicode,status: item.status,deptcode: item.deptcode}).then((data)=> {
  //                              console.log('new clinic added',data) 
  //                              router.reload()
  //                           }).catch((error)=> {
  //                               console.log(error)
  //                           })
  //                       }
  //                   }else{
  //                       if(!clinics.includes(item.clinicicode)){
  //                           axios.post("http://localhost:5000/clinic/create_clinic",{cliniciname: item.clinicname,clinicicode: item.clinicode,status: item.status,deptcode: item.deptcode}).then((data)=> {
  //                              console.log('new clinic added',data) 
  //                              router.reload()
  //                           }).catch((error)=> {
  //                               console.log(error)
  //                           })
  //                       }
  //                   }
  //               },3000)
  //           })
  //       }
  //   }).catch((error)=> {
  //       console.log(error)
  //   })
  // }

  const getClinics = () => {
    axios.get("http://localhost:5000/clinic/get_clinics").then((data)=> {
        console.log(data.data)
    }).catch((error)=> {
        console.log(error)
    })
  }

  return (
    <div>
      <h1>API Data Check</h1>
    </div>
  );
};

export default Clinics;
