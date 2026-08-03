import { createBrowserRouter } from 'react-router-dom'
import UserLayout from "./layouts/UserLayout.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx"
import Home from "./pages/Home.jsx"
import Services from "./pages/Services.jsx"
import Caregivers from "./pages/Caregivers.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminServices from "./pages/AdminServices.jsx"
import Blog from "./pages/Blog.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import ServiceType from './pages/ServiceType.jsx'
import Login from './pages/Login.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Profile from './pages/Profile.jsx'
import PatientForm from './pages/PatientForm.jsx'
import CaregiverForm from './pages/CaregiverForm.jsx'
import CaregiverDashboard from './pages/CaregiverDashboard.jsx'
import CaregiverServices from './pages/CaregiverServices.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import Booking from './pages/Booking.jsx'
import Bookings from './pages/Bookings.jsx'
import Chat from './pages/Chat.jsx'
import RequireRole from './components/RequireRole.jsx'

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
      },
      {
        path: "signin",
        element: <Login />
      },
      {
        path: "booking",
        element: (
            <RequireAuth>
                <Booking />
            </RequireAuth>
        )
      },
      {
        path: "profile",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        )
      },
      {
        path: "bePatient",
        element: (
          <RequireAuth>
            <PatientForm />
          </RequireAuth>
        )
      },
      {
        path: "beCaregiver",
        element: (
          <RequireAuth>
            <CaregiverForm />
          </RequireAuth>
        )
      },
      {
        path: "CaregiverDashboard",
        element: <RequireAuth><CaregiverDashboard /></RequireAuth>
      },
      {
        path: "caregiver-services",
        element: <RequireAuth><CaregiverServices /></RequireAuth>
      },
      {
        path: "PatientDashboard",
        element: <RequireAuth><PatientDashboard /></RequireAuth>
      },
      {
        path: "bookings",
        element: <RequireAuth><Bookings /></RequireAuth>
      },
      {
        path: "chat",
        element: <RequireAuth><Chat /></RequireAuth>
      }
    ]
  },
  {
    path: "/admin",
    element: <RequireRole role="admin"><AdminLayout /></RequireRole>,
    children: [
        {
            path: "",
            element: <AdminDashboard />
        },
        {
            path: "services",
            element: <AdminServices />
        }
    ]
  },
  
])

export default router;
