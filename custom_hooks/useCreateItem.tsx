import { useState } from 'react';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import messageState from '@/store/atoms/message';
import { useRouter } from 'next/router';

const useCreateItem = () => {
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useRecoilState(messageState)
  const router = useRouter()

  const createItem = async (ticket_no:string, stage:string, station:string, url: string,counter: string) => {
    setLoading(true);
    try{
        axios.post(url,{ticket_no:ticket_no,stage:stage,station:station,counter:counter})
        .then((data)=> {
            setTimeout(()=> {
                setLoading(false)
            },4000)
            //router.reload()
        }).catch((error)=> {
            setLoading(false)
            console.log(error.response)
            if(error.response.data.status===400){
                setMessage({...message,title: error.response.data.error,category: "error"})
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }else{
                setMessage({...message,title: error.message,category: "error"}) 
                setTimeout(()=> {
                    setMessage({...message,title: "",category: ""})  
                },4000)
            }
        }).finally(()=> {
            setTimeout(()=> {
                setLoading(false)
            },4000)
        })
    }catch(error){
        console.log(error)
    }
    // try {
    //   const response = await axios.post(url, {
    //     ticket_no,
    //     stage,
    //     station
    //   });
    //   if (response.status === 201 || response.status === 200) {
    //     setSuccess(true);
    //   }
    // } catch (error) {
    //     if(error.response.data.error===400){

    //     }
    //   setError(err.response ? err.response.data : 'An error occurred');
    // } finally {
    //   setLoading(false);
    // }
  };

  return {
    createItem,
    loading
  };
};

export default useCreateItem;
