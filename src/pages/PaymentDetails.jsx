/* eslint-disable react/prop-types */
import { Button } from '@mui/material'
import { FormElement, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../components/styles/GenericStyles'
import { useContext, useState } from "react";
import { GeneralContext } from "../App";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import axios from "axios";
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const PaymentDetails = () => {
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [payment, setpayment] = useState({});
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);

  // Fetch resouce information
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    console.log(serverUrl+'/api/v1/mppms/payment/findById?id='+params.id);

    axios.get(serverUrl+'/api/v1/mppms/payment/findById?id='+params.id)
    .then(response => {
      setpayment(response.data.payment);
      setApproved(response.data.payment.approved);
    })
    .catch(error => console.log(error));
  });

  // Update payment
  const updateResouce = (e) => {
    e.preventDefault();
    
    setIsProcessing(true); 

    axios.put(serverUrl+'/api/v1/mppms/payment/update?id='+payment._id, payment)
    .then(response => {
      if (response.status === 200) {
        setTimeout(() => {
          setIsProcessing(false);
          setResponseMessage({ message: response.data.message, severity: 'success' });
          setOpen(true);
          window.location.reload();
        }, 2000);
      }
    })
    .catch(error => {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setIsProcessing(false);
        setResponseMessage({ message: error.response.data.msg, severity:'error'})
        setOpen(true);
      }
    })
  };

  if (loading) {
    return (
      <p style={{ color: 'white' }}>Loading...</p>
    );
  }

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px', background: '#02457a' }}>
      <Helmet>
        <title>Payment details</title> 
      </Helmet>

      <HorizontallyFlexSpaceBetweenContainer style={{ alignItems:'flex-start', paddingBottom:'10px', borderBottom:'1px solid #a3c2c2' }}>
        <h2 style={{ width: '70%', color: 'white' }}>Payment details</h2>
      </HorizontallyFlexSpaceBetweenContainer>
      <VerticallyFlexGapForm onSubmit={updateResouce} style={{ gap: '20px', color: 'white', fontSize:'90%' }}>
        <HorizontallyFlexSpaceBetweenContainer style={{ fontSize: '100%', color: 'white', textAlign: 'left', alignItems: 'flex-start' }}>
          <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px' }}>
            <p>Description: <span style={{ color: 'white', textAlign: 'left' }}>{payment.description}</span></p>
            <p>Entry date: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(payment.entryDate).toLocaleString()}</span></p>
            <p>Approved: <span style={{ color: 'white', textAlign: 'left' }}>{payment.approved}</span></p>
          </VerticallyFlexGapContainer>
        </HorizontallyFlexSpaceBetweenContainer>
        <div style={{ color: '#97cadb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
          <label htmlFor="approved">Approve</label>
          <input 
            type="checkbox" 
            id="approved"
            name='approved'
            value={payment.approved}
            onChange={setApproved(!approved)} 
          />
        </div>
        <FormElement style={{ flexDirection: 'row', gap: '30%' }}>
          {isProcessing 
          ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
          : <Button variant="contained" color="success" size="small" type="submit">Confirm Updates</Button>
          }
          <Button variant="contained" color="secondary" size="small" type="button" onClick={() => {window.location.reload()}}>Cancel</Button>
        </FormElement>
      </VerticallyFlexGapForm>
    </VerticallyFlexGapContainer>
  )
}

export default PaymentDetails