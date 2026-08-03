import { Outlet } from "react-router-dom";

function AdminLayout(){
    return <main className="min-h-screen bg-background"><Outlet /></main>;
}

export default AdminLayout;
