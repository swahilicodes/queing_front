import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import messageState from '@/store/atoms/message';

const useFetchData = (url:string) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const setMessage = useSetRecoilState(messageState)
  const page = 1;
  const pagesize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.get(url).then((data:any) => {
            setData(data.data)
            setLoading(false)
            console.log(data.data)
        }).catch((error) => {
            console.log(error.response)
            setLoading(false)
            if (error.response && error.response.status === 400) {
              setMessage({...onmessage,title:error.response.data.error,category: "error"})
              setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})
              },3000)
            } else {
              setMessage({...onmessage,title:error.message,category: "error"})
              setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})
              },3000)
            }
        })
      } catch (error:any) {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
