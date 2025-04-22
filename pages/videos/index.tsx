import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import styles from './video.module.scss'
import { LuFileVideo } from 'react-icons/lu';
import cx from 'classnames'
import Cubes from '@/components/loaders/cubes/cubes';
import { useSetRecoilState } from 'recoil';
import messageState from '@/store/atoms/message';
import { MdDeleteOutline } from 'react-icons/md';

function Videos() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [file,setFile] = useState<File | null>(null)
    const [isAdd, setAdd] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const setMessage = useSetRecoilState(messageState)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState({
        name: "",
        description: "",
        url: ""
    })

    useEffect(()=> {
        getVideos()
        if(fields.url.trim() !== ""){
            axios.post("http://localhost:5000/uploads/upload-video",{name: fields.name,description: fields.description,url: fields.url}).then((data)=> {
                setFields({...fields,url: ""})
                setUploadProgress(0)
                setAdd(false)
                location.reload()
            }).catch((error)=> {
                if (error.response && error.response.status === 400) {
                    console.log(`there is an error ${error.message}`)
                    setMessage({...onmessage,title:error.response.data.error,category: "error"})
                    setTimeout(()=> {
                        setMessage({...onmessage,title:"",category: ""})  
                    },5000)
                } else {
                    setMessage({...onmessage,title:error.message,category: "error"})
                    setTimeout(()=> {
                        setMessage({...onmessage,title:"",category: ""})  
                    },5000)
                }
                setFields({...fields,url: ""})
            })
        }
    },[uploadProgress,fields.url])

    function removeBaseUrl(fullUrl: string): string {
        // Define possible base URLs
        const baseUrls = [
          'http://192.168.30.245:5000',
          'http://localhost:5000',
          // Add any other variations if needed
        ];
      
        // Find which base URL matches (if any)
        const matchedBaseUrl = baseUrls.find(baseUrl => fullUrl.startsWith(baseUrl));
      
        // If a base URL is found, remove it
        if (matchedBaseUrl) {
          return fullUrl.substring(matchedBaseUrl.length);
        }
      
        // If no base URL matches, return the original string
        return fullUrl;
      }

    const getVideos = () => {
        setLoading(true)
        axios.get("http://localhost:5000/uploads/get_videos").then((data)=> {
        setVideos(data.data)
        setLoading(false)
        }).catch((error)=> {
            if (error.response && error.response.status === 400) {
                console.log(`there is an error ${error.message}`)
                setMessage({...onmessage,title:error.response.data.error,category: "error"})
                setTimeout(()=> {
                    setMessage({...onmessage,title:"",category: ""}) 
                    setLoading(false) 
                },5000)
            } else {
                setMessage({...onmessage,title:error.message,category: "error"})
                setTimeout(()=> {
                    setMessage({...onmessage,title:"",category: ""})
                    setLoading(false)  
                },5000)
            }
        })
    }
    const deleteVideo = (id:number,url:string) => {
        console.log('video url is ',url)
        axios.post("http://localhost:5000/uploads/delete_video",{id:id, url: url}).then((data)=> {
        location.reload()
        }).catch((error)=> {
            if (error.response && error.response.status === 400) {
                console.log(`there is an error ${error.message}`)
                setMessage({...onmessage,title:error.response.data.error,category: "error"})
                setTimeout(()=> {
                    setMessage({...onmessage,title:"",category: ""}) 
                    setLoading(false) 
                },5000)
            } else {
                console.log(error)
                setMessage({...onmessage,title:error.message,category: "error"})
                setTimeout(()=> {
                    setMessage({...onmessage,title:"",category: ""})
                    setLoading(false)  
                },5000)
            }
        })
    }
  
    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setVideoURL(url);
        setFile(file)
      } else {
        setMessage({...onmessage,title:"Please select a valid video file",category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
      }
    };

    const uploadVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            console.error('No file selected');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            axios.post("http://localhost:5000/uploads/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            }).then((data)=> {
                setFields({...fields,url: data.data.url})
            }).catch((error)=> {
                if (error.response && error.response.status === 400) {
                    setMessage({...onmessage,title:error.response.data.error,category: "error"})
                    setTimeout(()=> {
                        setMessage({...onmessage,title:"",category: ""})  
                    },5000)
                } else {
                    setMessage({...onmessage,title:error.message,category: "error"})
                    setTimeout(()=> {
                        setMessage({...onmessage,title:"",category: ""})  
                    },5000)
                }
                setFields({...fields,url: ""})
            })
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
  return (
    <div className={styles.video_page}>
     <div className={styles.top}>
        <div className={styles.left}>Video Page</div>
        <div className={styles.right}>
            <button onClick={()=> setAdd(true)}>Add Video</button>
        </div>
     </div>
     {
        isAdd && (
            <div className={styles.overlay}>
                <div className={cx(styles.contents, uploadProgress> 0 && styles.loading)}>
                    <form onSubmit={uploadVideo}>
                       <div className={styles.videoa} onChange={handleFileChange}>
                       <input
                            id='vid_id'
                            type="file"
                            accept="video/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {
                            videoURL
                            ? <div className={styles.video_wrapper}>
                                    <video src={videoURL} controls/>
                                </div>
                            : <label htmlFor="vid_id">
                                <LuFileVideo size={50}/>
                            </label>
                        }
                        </div> 
                        <input
                        value={fields.name} 
                        onChange={e => setFields({...fields, name: e.target.value})}
                        type="text" 
                        placeholder='Video Name'
                        required
                        />
                        <textarea
                        value={fields.description} 
                        onChange={e => setFields({...fields, description: e.target.value})} 
                        placeholder='Video Description'
                        required
                        />
                        <button type='submit'>Upload Video</button>
                    </form>
                </div>
                {
                    uploadProgress>0 && (
                        <div className={styles.upload_progress}>
                            <p>{uploadProgress} %</p>
                            <Cubes/>
                        </div>
                    )
                }
            </div>
        )
     }
    <div className={styles.video_content}>
        {
            videos.length <1
            ? <div className={styles.video_loader}>
                {
                    loading
                    ? <Cubes/>
                    : <p>No Videos</p>
                }
            </div>
            : <div className={styles.video_list}>
                {
                    videos.map((item:any,index)=> (
                        <div className={styles.wrapper} key={index}>
                            <p>{item.id}</p>
                            <p>{item.name}</p>
                            <div className={styles.video_div}>
                                <video src={item.url}></video>
                            </div>
                            {/* <p>{item.url}</p> */}
                            <div className={styles.action} onClick={()=> deleteVideo(item.id,item.url)}>
                             <MdDeleteOutline className={styles.icon__} size={30}/>
                            </div>
                        </div>
                    ))
                }
            </div>
        }
    </div>
    </div>
  )
}

export default Videos
