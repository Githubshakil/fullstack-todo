import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { verifyEmail } from '../features/auth/authSlice'

const VerifyEmail = () => {
  const {token} =useParams()

  const dispatch = useDispatch()
  const {message, error} = useSelector(state => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
    }
  },[])

  return (
    <div>Verifying email please wait for a while......</div>
  )
}

export default VerifyEmail