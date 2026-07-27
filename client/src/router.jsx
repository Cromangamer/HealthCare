import { StrictMode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import UserLayout from "./layouts/UserLayout.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"
import Home from "./pages/Home.jsx"
import Services from "./pages/Services.jsx"
import Caregivers from "./pages/Caregivers.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import Blog from "./pages/Blog.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import ServiceType from './pages/ServiceType.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,

        element: <Home />
      },
      {
        path: "services",
        element: <Services />
      },
      {
        path: "caregivers",
        element: <Caregivers />
      },
      {
        path: "blog",
        element: <Blog />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "service/:Type",
        element: <ServiceType />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {
            path: "",
            element: <AdminDashboard />
        }
    ]
  }
])

export default router;