import { Button } from '@mui/material'
import { FormElement, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../styles/GenericStyles'
import { useContext, useState } from "react";
import { GeneralContext } from "../../App";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import axios from "axios";
import { useDispatch } from "react-redux";
import { getProjectResources } from "../../redux/features/materialSlice";
import { measurementUnits } from "../../utils/MeasurementUnits";
import { useEffect } from 'react';
import { currencies } from '../../utils/Currencies';

const ResourcesDetails = ({data}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resource, setResource] = useState({});
  const { setOpen, setResponseMessage, handleOpenModal } = useContext(GeneralContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Handle input changes
  const handleChange = ({ currentTarget: input }) => {
    setResource({ ...resource, [input.name]: input.value });
  }

  // Fetch resouce information
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    axios.get(serverUrl+'/api/v1/mppms/material/findById?id='+data.id)
    .then(response => {
      response.data.material.entryDate = new Date(response.data.material.entryDate).toUTCString();
      response.data.material.remaining = Number(response.data.material.quantity) - Number(response.data.material.used);
      setResource(response.data.material);
    })
    .catch(error => console.log(error));
  },[]);

  // Update resource 
  const updateResouce = (e) => {
    e.preventDefault();
    setIsProcessing(true); 
    axios.put(serverUrl+'/api/v1/mppms/material/update?id='+resource._id, resource)
    .then(response => {
      if (response.status === 200) {
        dispatch(getProjectResources(resource.project));
        setTimeout(() => {
          setIsProcessing(false);
          setResponseMessage({ message: response.data.message, severity: 'success' });
          setOpen(true);
          handleOpenModal();
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

  // Delete resource
  const deleteResource = (e) => {
    e.preventDefault();
    axios.delete(serverUrl+'/api/v1/mppms/material/delete?id='+resource._id)
    .then(response => {
      if (response.status === 200) {
        dispatch(getProjectResources(resource.project));
        handleOpenModal();
      }
    })
    .catch(error => {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setResponseMessage({ message: error.response.data.msg, severity:'error'})
        setOpen(true);
      }
    })
  }

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px' }}>
      <HorizontallyFlexSpaceBetweenContainer style={{ alignItems: 'flex-start' }}>
        <div className='left' style={{ flexDirection: 'column', gap: '10px' }}>
          <h2>Resource Info</h2>
          <p style={{ color: '#97cadb' }}>Entry date: <strong>{resource.entryDate}</strong></p>
        </div>
        <Button variant='contained' size='small' color='error' onClick={deleteResource}>Delete</Button>
      </HorizontallyFlexSpaceBetweenContainer>
      <VerticallyFlexGapForm onSubmit={updateResouce} style={{ gap: '20px', color: '#97cadb', fontSize:'90%' }}>
        <HorizontallyFlexSpaceBetweenContainer style={{ color: 'black', alignItems: 'flex-start' }}>
          <div className='left' style={{ flexDirection: 'column', gap: '10px' }}>
            <p>Quantity: <strong>{resource.quantity}</strong></p>
            <p>Assigned: <strong>{resource.assigned}</strong></p>
            <p>Used: <strong>{resource.used}</strong></p>
            <p>Remaining: <strong>{resource.remaining}</strong></p>
          </div>
          <div className='right' style={{ flexDirection: 'column', gap: '10px' }}>
            <p>Measurement unit: <strong>{resource.measurementUnit}</strong></p>
            <p>Currency: <strong>{resource.currency}</strong></p>
            <p>Total price: <strong>{resource.totalPrice}</strong></p>
          </div>
        </HorizontallyFlexSpaceBetweenContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={handleChange} value={resource.name} />
          </FormElement>
          <FormElement>
            <label htmlFor="type">Type</label>
            <input name="type" id="type" onChange={handleChange} value={resource.type} />
          </FormElement>
        </HorizontallyFlexGapContainer>
        <FormElement>
          <label htmlFor="description">Description</label>
          <textarea type="text" name="description" id="description" onChange={handleChange} value={resource.description}></textarea>
        </FormElement>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="quantity">{`Quantity in ${resource.measurementUnit}`}</label>
            <input type="number" name="quantity" id="quantity" onChange={handleChange} value={resource.quantity} />
          </FormElement>
          <FormElement>
            <label htmlFor="measurementUnit">Change Unit</label>
            <select name="measurementUnit" id="measurementUnit">
              <option value="">Select unit</option>
              {measurementUnits.map((measurementUnit, index) => (
                  <option key={index} value={measurementUnit}>{measurementUnit}</option>
              ))}
            </select>
          </FormElement>
        </HorizontallyFlexGapContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="unitPrice">Unit price</label>
            <input type="text" name="unitPrice" id="unitPrice" onChange={handleChange} value={resource.unitPrice} />
          </FormElement>
          <FormElement>
            <label htmlFor="unitPrice">Change currency</label>
            <select name="currency" id="currency">
              <option value="">Select current</option>
              {currencies.map((currency, index) => (
                  <option key={index} value={currency}>{currency}</option>
              ))}
            </select>
          </FormElement>
        </HorizontallyFlexGapContainer>
        <FormElement style={{ flexDirection: 'row', gap: '30%' }}>
          {isProcessing 
          ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
          : <Button variant="contained" color="primary" size="small" type="submit">Confirm Updates</Button>
          }
          <Button variant="contained" color="secondary" size="small" type="button" onClick={() => {window.location.reload()}}>Cancel</Button>
        </FormElement>
      </VerticallyFlexGapForm>
    </VerticallyFlexGapContainer>
  )
}

export default ResourcesDetails