import {Box, Modal } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerifyRegistration from './VerifyRegistration';
import ForgotPassword from './ForgotPassword';
import { useLocation, useNavigate } from 'react-router-dom';

const Auth = () => {
  const location=useLocation();
  const navigate=useNavigate();

  const handleOnClose=()=>{
    navigate("/")
  }



  return (
    <Modal
        onClose={handleOnClose}
        open={
            location.pathname==="/account/register"
            || location.pathname==="/account/login"
            || location.pathname==="/account/verify"
            || location.pathname==="/account/forgot-password"
        }
        
      
    >
        <Box
        sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}>
        {location.pathname==="/account/register"
          ? <RegisterForm/>
          : location.pathname==="/account/verify"
            ? <VerifyRegistration/>
            : location.pathname==="/account/forgot-password"
              ? <ForgotPassword/>
              : <LoginForm/>}

        </Box>
      
    </Modal>
  );
};

export default Auth;