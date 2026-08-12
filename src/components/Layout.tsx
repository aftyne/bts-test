import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { Toaster } from "./ui/toast"

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default Layout
