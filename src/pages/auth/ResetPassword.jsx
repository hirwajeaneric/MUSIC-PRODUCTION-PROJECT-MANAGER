import { Link, useParams } from "react-router-dom"
import { FormElement, HeaderOne, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm, VerticallyFlexSpaceBetweenContainer } from "../../components/styles/GenericStyles"
import { useForm } from 'react-hook-form';
import axios from 'axios';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { useCookies } from 'react-cookie';
import { GeneralContext } from "../../App";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthenticationFormContainer } from "../../components/styles/AuthenticationPagesStyles";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  const params = useParams();
  const [ cookies, setCookie, removeCookie ] = useCookies(null);
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const [ showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    if (data.password !== data.confirmPassword) {
      setResponseMessage({message:'Passwords do not match', severity: 'warning'});
      setOpen(true);
      return;
    } else {
      const config = {
        headers: {
          'Authorization' : `Bearer ${params.token}`
        }
      }

      setIsProcessing(true);
      axios.put(serverUrl+'/api/v1/mppms/user/resetPassword?id='+params.userId, {password: data.password}, config)
      .then(response => {
        setTimeout(() => {
          if (response.status === 200) {
            setIsProcessing(false);
            setResponseMessage({message: 'Password changed' , severity: 'success'});
            setOpen(true);
            setTimeout(() => {
              window.location.replace('/auth/signin');
            },2000);
          }
        }, 3000)
      })
      .catch(error => {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setIsProcessing(false);
          setResponseMessage({ message: error.response.data.msg, severity:'error'})
          setOpen(true);
        }
      })
    }
  };

  return (
    <HorizontallyFlexSpaceBetweenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Helmet>
        <title>Forgot password</title>
        <meta name="description" content={`Forgot password.`} /> 
      </Helmet>
      <AuthenticationFormContainer style={{ position: 'relative', boxShadow: 'rgba(0, 0, 0, 0.05) 0 6px 24px, rgba(0, 0, 0, 0.08) 0 5px 12px 1px' }}>

        <VerticallyFlexSpaceBetweenContainer className="left" style={{ position: 'absolute', left: '0', top: '0', bottom: '0', background: "#02457a", height: '100%', gap: '50px' }}>
          <VerticallyFlexGapContainer style={{ gap: '30px', textAlign:'center', color:'white' }}>
            <h1 style={{ fontWeight: '900' }}>Soundss Pro</h1>
            <p style={{ lineHeight:'2rem', color: '#cce6ff' }}>Quality project organization,  management and tracking,  all done in one place. Achieved by the use of Soundss Pro. </p>
          </VerticallyFlexGapContainer>
          <VerticallyFlexGapContainer style={{ gap: '30px',color:'white' }}>
            <p>&copy; All rights reserved. Soundss Pro2023</p>
          </VerticallyFlexGapContainer>
        </VerticallyFlexSpaceBetweenContainer>

        <VerticallyFlexGapForm className="right" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <HeaderOne>Reset password</HeaderOne>
          </div>
          <FormElement>
            <label style={{ color: 'black' }} htmlFor="password">New Password</label>
            <input 
              style={{ color: 'black', border: '1.5px solid black' }}
              type="password"
              id="password" 
              placeholder="password" 
              {...register("password", {required: true})} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password?.type === "required" && (
              <p role="alert">Password is required</p>
            )}
          </FormElement>
          <FormElement>
            <label style={{ color: 'black' }} htmlFor="confirmPassword">Confirm Password</label>
            <input 
              style={{ color: 'black', border: '1.5px solid black' }}
              type="password"
              id="confirmPassword" 
              placeholder="Confirm password" 
              {...register("confirmPassword", {required: true})} 
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword?.type === "required" && (
              <p role="alert">Please confirm your password</p>
            )}
          </FormElement>  
          
          <FormElement>
            {isProcessing 
              ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
              : <Button variant="contained" color="primary" size="medium" type="submit">Set password</Button>
            }
          </FormElement>
          <Link style={{ color: '#97cadb', fontSize:'90%', textAlign: 'center', textDecoration: 'none' }} to={'/auth/signin'}>I can't recover my account using this page</Link>
        </VerticallyFlexGapForm>
        
      </AuthenticationFormContainer>
    </HorizontallyFlexSpaceBetweenContainer>
  )
}

export default ForgotPassword