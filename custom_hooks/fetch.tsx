import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';

const useFetchData = (url:string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const page = 1;
  const pagesize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.get(url).then((data:any) => {
            setData(data.data)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            if (error.response && error.response.status === 400) {
                console.log(`there is an error ${error.message}`)
                alert(error.response.data.error);
            } else {
                console.log(`there is an error message ${error.message}`)
                alert(error.message);
            }
        })
      } catch (error:any) {
        alert(error);
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
