/* eslint-disable react/prop-types */
import { Button } from '@mui/material'
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../styles/GenericStyles'
import { useContext, useState } from "react";
import { GeneralContext } from "../../App";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import axios from "axios";
import { useDispatch } from "react-redux";
import { getProjectResources } from "../../redux/features/materialSlice";
import { useEffect } from 'react';
import { ProjectTypes } from '../../utils/ProjectTypes';
import { WorldCountries } from '../../utils/WorldCountries';
import { currencies } from '../../utils/Currencies';

const MoreProjectDetails = ({data}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [project, setProject] = useState({});
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Handle input changes
  const handleChange = ({ currentTarget: input }) => {
    setProject({ ...project, [input.name]: input.value });
  }

  // Fetch resouce information
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    axios.get(serverUrl+'/api/v1/mppms/project/findById?id='+data._id)
    .then(response => {
      setProject(response.data.project);
    })
    .catch(error => console.log(error));
  },[data._id]);

  // Update project
  const updateResouce = (e) => {
    e.preventDefault();
    setIsProcessing(true); 
    axios.put(serverUrl+'/api/v1/mppms/project/update?id='+project._id, project)
    .then(response => {
      if (response.status === 200) {
        dispatch(getProjectResources(project._id));
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

  // Delete project
  const deleteProject = (e) => {
    e.preventDefault();
    axios.delete(serverUrl+'/api/v1/mppms/project/delete?id='+project._id)
    .then(response => {
      if (response.status === 200) {
        setResponseMessage({ message: 'Project deleted', severity:'success'})
        setOpen(true);

        setTimeout(() => {
          window.location.replace('/projects');
        }, 1500)
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
      <p style={{ color: 'white' }}>Loading...</p>
    );
  }

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px', background: '#02457a' }}>
      <HorizontallyFlexSpaceBetweenContainer style={{ alignItems:'flex-start', paddingBottom:'10px', borderBottom:'1px solid #a3c2c2' }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '10px' }}>
          <strong style={{ color: 'white' }}>Project</strong>
          <HeaderTwo style={{ width: '100%', textAlign: 'left', color: '#d6e8ee' }}>{project.name}</HeaderTwo>
        </div>
        <Button variant='contained' size='small' color='error' onClick={deleteProject}>Delete</Button>
      </HorizontallyFlexSpaceBetweenContainer>
      <VerticallyFlexGapForm onSubmit={updateResouce} style={{ gap: '20px', color: 'white', fontSize:'90%' }}>
        <HorizontallyFlexSpaceBetweenContainer style={{ fontSize: '100%', color: 'white', textAlign: 'left', alignItems: 'flex-start' }}>
          <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px' }}>
            <p>Create on: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(project.creationDate).toLocaleString()}</span></p>
            <p>Start date: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(project.startDate).toLocaleString()}</span></p>
            <p>Status: <span style={{ color: 'white', textAlign: 'left' }}>{project.status}</span></p>
          </VerticallyFlexGapContainer>
          <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px' }}>
            {/* <p>Manager: <span style={{ color: 'white', textAlign: 'left' }}>{project.ownerName}</span></p> */}
            <p>Progress: <span style={{ color: 'white', textAlign: 'left' }}>{`${project.progress.toFixed(1)} %`}</span></p>
            <p>Project type: <span style={{ color: 'white', textAlign: 'left' }}>{project.projectType}</span></p>
          </VerticallyFlexGapContainer>
        </HorizontallyFlexSpaceBetweenContainer>
        <HorizontallyFlexSpaceBetweenContainer style={{ fontSize: '100%', color: 'white', textAlign: 'left', paddingBottom:'20px', borderBottom:'1px solid #a3c2c2' }}>
          <Button variant='contained' type='button' size='small' color='info' onClick={() => { window.location.replace(`/${project.code}/resources`) }}>Add/View Resources</Button>
          <Button variant='contained' type='button' size='small' color='secondary' onClick={() => { window.location.replace(`/${project.code}/milestones`) }}>Add/View Milestones</Button>
        </HorizontallyFlexSpaceBetweenContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={handleChange} value={project.name} />
          </FormElement>
          <FormElement>
            <label htmlFor="type">Start date</label>
            <input type={'date'} name="type" id="type" onChange={handleChange} value={project.startDate} />
          </FormElement>
        </HorizontallyFlexGapContainer>
        <FormElement>
          <label htmlFor="description">Description</label>
          <textarea rows={5} type="text" name="description" id="description" onChange={handleChange} value={project.description}></textarea>
        </FormElement>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement style={{ color: 'white' }}>
            <label htmlFor="projectType">Change project type</label>
            <select name='projectType' id='projectType' value={project.projectType} onChange={handleChange}>
              <option value="">Select type</option>
              {ProjectTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </FormElement>
          <FormElement style={{ color: 'white' }}>
            <label htmlFor="country">Country *</label>
            <select name='country' id='country' value={project.country} onChange={handleChange}>
              <option value="">Choose country</option>
              {WorldCountries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </FormElement>
        </HorizontallyFlexGapContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="city">City</label>
            <input type="text" name="city" id="city" onChange={handleChange} value={project.city} />
          </FormElement>
          <FormElement>
            <label htmlFor="province">Province</label>
            <input type="text" name="province" id="province" onChange={handleChange} value={project.province} />
          </FormElement>
          <FormElement>
            <label htmlFor="district">District</label>
            <input type="text" name="district" id="district" onChange={handleChange} value={project.district} />
          </FormElement>
        </HorizontallyFlexGapContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="sector">Sector</label>
            <input type="text" name="sector" id="sector" onChange={handleChange} value={project.sector} />
          </FormElement>
          <FormElement>
            <label htmlFor="address">Address</label>
            <input type="text" name="address" id="address" onChange={handleChange} value={project.address} />
          </FormElement>
        </HorizontallyFlexGapContainer>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <FormElement>
            <label htmlFor="price">Price</label>
            <input type="number" name="price" id="price" onChange={handleChange} value={project.price} />
          </FormElement>
          <FormElement style={{ color: 'white' }}>
            <label htmlFor="currency">Currency *</label>
            <select name='currency' value={project.currency} onChange={handleChange}>
                <option value="">Choose currency</option>
                {currencies.map((currency, index) => (
                    <option key={index} value={currency}>{currency}</option>
                ))}
            </select>
          </FormElement>
          <FormElement style={{ color: 'white' }}>
              <label htmlFor="paymentStrategy">Payment strategy *</label>
              <select name='paymentStrategy' id='paymentStrategy' value={project.paymentStrategy} onChange={handleChange}>
                <option value="">Change strategy</option>
                <option value="50% Before - 50% After">50% Before - 50% After</option>
                <option value="100% before">100% before</option>
                <option value="100% after">100% after</option>
              </select>
          </FormElement>
        </HorizontallyFlexGapContainer>
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

export default MoreProjectDetails