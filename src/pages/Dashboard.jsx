import React from 'react'
import Navbar from '../components/common/Navbar'
import SidePannel from '../components/common/SidePannel'
const Dashboard = () => {
  return (
   <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="  fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar/>
      </nav>

      {/* Side Panel */}
      <aside className=" fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel/>
      </aside>
        Dashboard</div>
  )
}

export default Dashboard