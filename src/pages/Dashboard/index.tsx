import { Strings } from 'config/Strings'
import { LOGIN_EMAIL } from 'helper/storage'
import React from 'react'
import { Card } from 'react-bootstrap'

const Dashboard = () => {
  const loginEmail = localStorage.getItem(LOGIN_EMAIL)
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
        width: "200px",
        height: "100px",
        padding: "9px 10px"
      }}>
        <h4>{Strings.loginEmail}</h4>
        <p>{loginEmail}</p>
      </div>
    </div>
  )
}

export default Dashboard
