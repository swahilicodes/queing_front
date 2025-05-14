import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Item{
    itema: number
}

function DoctorPatients({itema}:Item) {
const [patients, setPatients] = useState([])

useEffect(()=> {
    getpats()
},[])
 const getpats = () => {
    axios.get('http://localhost:5000/doktas/get_dokta_patients',{
        params: {id:itema}
    }).then((data)=> {
        setPatients(data.data)
    }).catch((error)=> {
        console.log(error)
    })
 }
  return (
    <div>{patients.length}</div>
  )
}

export default DoctorPatients
