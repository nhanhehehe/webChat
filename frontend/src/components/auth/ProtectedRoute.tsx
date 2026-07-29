import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {

    const {accessToken, user, loading, refreshMe, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        
        if (!accessToken) {
            await refreshMe();
        }

        if (accessToken && !user) {
            await fetchMe();
        }

        setStarting(false);
    }

    useEffect(() => {
        init();
    }, [])


    if (starting || loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                Loading...
            </div>
        )
    }

    if (!accessToken) {
        return (
            <Navigate
                to={"/signin"}
                replace
            />
        )
    }
  return (
    <Outlet>

    </Outlet>
  )
}

export default ProtectedRoute