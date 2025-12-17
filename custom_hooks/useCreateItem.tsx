import { useState } from 'react';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import messageState from '@/store/atoms/message';
import { useRouter } from 'next/router';

const useCreateItem = () => {
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useRecoilState(messageState)
  const router = useRouter()

  const createItem = async (ticket_no:string, stage:string, station:string, url: string,counter: string,attendant_id:string) => {
    setLoading(true);
    try{
        axios.post(url,{ticket_no:ticket_no,stage:stage,station:station,counter:counter,attendant_id: attendant_id})
        .then((data)=> {
            setTimeout(()=> {
                setLoading(false)
            },4000)
            //router.reload()
        }).catch((error)=> {
            if(error.response.status===400){
                setMessage({...message,title: error.response.data.error,category: "success"})
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }else{
                setMessage({...message,title: error.message,category: "success"}) 
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }
        }).finally(()=> {
            setTimeout(()=> {
                setLoading(false)
            },4000)
        })
    }catch(error:any){
        if(error.response.status===400){
                setMessage({...message,title: error.response.data.error,category: "success"})
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }else{
                setMessage({...message,title: error.message,category: "success"}) 
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }
    }
  };

  return {
    createItem,
    loading
  };
};

export default useCreateItem;
