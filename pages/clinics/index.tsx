import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface DataItem {
  id: number;
  cliniciname: string;
  clinicicode: string;
  status: string;
  deptcode: string;
  createdAt: Date,
  updatedAt: Date
}

const Clinics = () => {
  const [apiData, setApiData] = useState<DataItem[]>([]);
  const [clinics, setClinics] = useState<DataItem[]>([])
  const router = useRouter()

  useEffect(() => {
    getClinics()
    // jeevaClinics()
  }, []);

  const jeevaClinics = () => {
    axios.get("http://localhost:5000/clinic/jeeva_clinics").then((data)=> {
        if(data.status === 200){
            data.data.data.forEach((item:any) => {
                console.log(item)
                setInterval(()=> {
                    if(clinics.length> 0){
                        if(!clinics.includes(item.clinicicode)){
                            axios.post("http://localhost:5000/clinic/create_clinic",{cliniciname: item.clinicname,clinicicode: item.clinicode,status: item.status,deptcode: item.deptcode}).then((data)=> {
                               console.log('new clinic added',data) 
                               router.reload()
                            }).catch((error)=> {
                                console.log(error)
                            })
                        }
                    }else{
                        if(!clinics.includes(item.clinicicode)){
                            axios.post("http://localhost:5000/clinic/create_clinic",{cliniciname: item.clinicname,clinicicode: item.clinicode,status: item.status,deptcode: item.deptcode}).then((data)=> {
                               console.log('new clinic added',data) 
                               router.reload()
                            }).catch((error)=> {
                                console.log(error)
                            })
                        }
                    }
                },3000)
            })
        }
    }).catch((error)=> {
        console.log(error)
    })
  }

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
