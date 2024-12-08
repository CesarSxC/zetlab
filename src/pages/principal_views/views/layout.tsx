import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom";
import Navbar from "@/pages/principal_views/components/navbar"
import Sidebar from "@/pages/principal_views/components/sidebar"

const Layout = () => {
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setExpanded(false)
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => setExpanded(!expanded)

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && <Sidebar expanded={expanded} toggleSidebar={toggleSidebar} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 