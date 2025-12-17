import axios from 'axios'
import React, { useEffect, useState } from 'react'

function AllTickets() {
 const [tickets, setTickets] = useState([])
 const [loading,setLoading] = useState(false)

 useEffect(()=> {
    getTickets()
 },[tickets])

  const getTickets = () => {
    setLoading(true)
    axios.get("http://localhost:5000/tickets/get_all_the_tickets").then((data)=> {
        setTickets(data.data)
        setLoading(false)
    }).catch((error)=> {
        setLoading(false)
    }).finally(()=> {
        setLoading(false)
    })
  }
  return (
    <div>
      {
        tickets.length<1?"0":tickets.length
      }
    </div>
  )
}

export default AllTickets
