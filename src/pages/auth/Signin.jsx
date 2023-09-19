import { Link } from "react-router-dom"
import { FormElement, HeaderTwo, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../../components/styles/GenericStyles"
import { useForm } from 'react-hook-form';
import axios from 'axios';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { useCookies } from 'react-cookie';
import { GeneralContext } from "../../App";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthenticationFormContainer } from "../../components/styles/AuthenticationPagesStyles";
import { Helmet } from "react-helmet-async";

const Signin = () => {
  const [ cookies, setCookie, removeCookie ] = useCookies(null);
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const [ visible, setVisible ] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    
    setIsProcessing(true);
    axios.post(serverUrl+'/api/v1/mppms/user/signin', data)
    .then(response => {
      setTimeout(() => {
        if (response.status === 200) {
          console.log(response.status === 200);
          console.log(response.data.user);

          setIsProcessing(false);
          setCookie('AuthToken', response.data.user.token);
          setCookie('UserData', JSON.stringify(response.data.user));
          window.location.replace('/');
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
  };

  return (
    <HorizontallyFlexSpaceBetweenContainer style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Helmet>
        <title>Login</title>
        <meta name="description" content={`Login to your account.`} /> 
      </Helmet>
      <AuthenticationFormContainer style={{ position: 'relative', boxShadow: 'rgba(0, 0, 0, 0.05) 0 6px 24px, rgba(0, 0, 0, 0.08) 0 5px 12px 1px' }}>

        <VerticallyFlexGapForm className="right" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }} onSubmit={handleSubmit(onSubmit)}>
          <VerticallyFlexGapContainer style={{ gap: '20px', textAlign:'left', color:'black', width: '100%' }}>
            <h1 style={{ fontWeight: '900', width: '100%', color: '#001b4b' }}>Soundss Pro</h1>
            <p style={{ lineHeight:'1.5rem', color: 'black' }}>Quality project organization,  management and tracking,  all done in one place. Achieved by the use of Soundss Pro. </p>
          </VerticallyFlexGapContainer>
          
          <HeaderTwo style={{ fontSize: '1.5rem' }}>Account Login</HeaderTwo>
          <FormElement>
            <label style={{ color: 'black' }} htmlFor="email">Email address</label>
            <input 
              style={{ color: 'black', border: '1.5px solid black' }}
              type="email" 
              id="email"
              placeholder="Email" 
              {...register("email", 
              {required: true})} 
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type === "required" && (
              <p role="alert">Email is required</p>
            )}
          </FormElement>  
          <FormElement>
            <label style={{ color: 'black' }} htmlFor="password">Password</label>
            <input 
              style={{ color: 'black', border: '1.5px solid black' }}
              type={visible ? "text" : "password"}
              id="password" 
              placeholder="Password" 
              {...register("password", {required: true})} 
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password?.type === "required" && (
              <p role="alert">Password is required</p>
            )}
          </FormElement>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
            <p>Show password</p>
            <input type='checkbox' name='visible' value={visible} onChange={() => setVisible(!visible)} />
          </div>
          <Link style={{ color: 'blue' }} to={'/auth/forgot-password'}>Forgot Password?</Link>
          <FormElement>
            {isProcessing 
              ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
              : <Button variant="contained" color="primary" size="small" type="submit">Log in</Button>
            }
          </FormElement>
          <VerticallyFlexGapContainer style={{ gap: '30px', width: '100%', color:'black' }}>
            <div style={{ textAlign:'left', width: '100%', }}>
              <p style={{ lineHeight:'2rem' }}>Don&lsquo;t have an account?</p>
              <Link style={{ color: 'blue', textAlign: 'center' }} to={'/auth/signup'}>Get started</Link>
            </div>
            <p>&copy; All rights reserved. Soundss Pro2023</p>
          </VerticallyFlexGapContainer>
        </VerticallyFlexGapForm>
        
      </AuthenticationFormContainer>
    </HorizontallyFlexSpaceBetweenContainer>
  )
}

export default Signin