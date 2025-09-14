import React, { useEffect } from 'react'
import './App.css'
import api from './api'
const App = () => {

  useEffect(()=>{
    api.get("/users").then((data)=>{
      console.log(data)
    })
  })



  return (
    <div>App</div>
  )
}

export default App