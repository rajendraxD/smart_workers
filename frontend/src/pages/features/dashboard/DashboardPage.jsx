import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/slices/authSlice'
import LoadingSpinner from '../../../components/common/LoadingSpinner';
function DashboardPage() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await dispatch(logout()).unwrap();
      // if (res?.success != true) return;
      window.location.href = '/login';
    } catch (error) {
      console.log(error)
    }

  }
  if (isLoading) return <LoadingSpinner />
  return (
    <div>DashboardPage
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>

    </div>
  )
}

export default DashboardPage