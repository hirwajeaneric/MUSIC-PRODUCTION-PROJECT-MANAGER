import { Avatar, Button } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../components/styles/GenericStyles"
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import PersonIcon from '@mui/icons-material/Person';
import Soundss ProtionIcon from '@mui/icons-material/Soundss Protion';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useForm } from "react-hook-form";
import { GeneralContext } from "../App";

const EditProject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoading, listOfProducersProjects, listOfManagerProjects } = useSelector(state => state.project);
  const [openAddManagerForm, setOpenAddManagerForm] = useState(false);
  const { setOpen, setResponseMessage } = useContext(GeneralContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [project, setProject] = useState({});
  
  // Fetching project 
  useEffect(() => {
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then((response) => {
      setProject(response.data.project)
    })
    .catch(error => console.log(error))
  },[]);

  const sendEmail = (email) => {
    const response = axios.post(`${serverUrl}/api/v1/mppms/email/`, email)
  }

  // Adding owner function 
  const onSubmit = async data => {
    setIsProcessing(true);
    await axios.put(serverUrl+'/api/v1/mppms/project/update?id='+project._id, data)
    .then(response => {
      setTimeout(() => {
        if (response.status === 200) {
          sendEmail({
            email: data.email, 
            subject: 'You have been added to a Soundss ProProject', 
            text: `Dear ${data.ownerName}, \nYou have been added to a Soundss Proproject: \n\nName: ${project.name} \nCode: ${project.code} \nby ${project.consultantName}. \n\nClick on the link bellow to view more about the project: \nhttp://localhost:5000/${project.code}`
          })
          
          setIsProcessing(false);
          setResponseMessage({ message: 'User added', severity: 'success' });
          setOpen(true);
          setTimeout(() => { window.location.reload() }, 2000);
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
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`${project.code} - Project details`}</title>
        <meta name="description" content={`A list of both my projects and projects I manage.`} /> 
      </Helmet>
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        {isLoading ? <p>Loading...</p> :
          <VerticallyFlexGapContainer style={{ gap: '20px'}}>
            <HorizontallyFlexSpaceBetweenContainer style={{ borderBottom: '1px solid #a3c2c2', paddingBottom: '10px' }}>
              <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>{project.name}</HeaderTwo>
              <HorizontallyFlexGapContainer style={{ gap: '20px', justifyContent: 'flex-end' }}>
                <p style={{ color: 'black' }}>Code: <span style={{ color: '#97cadb' }}>{project.code}</span></p>
                <Button variant='contained' size='small' color='info'>Edit/View</Button>
              </HorizontallyFlexGapContainer>
            </HorizontallyFlexSpaceBetweenContainer>
            <p style={{ color: '#97cadb', textAlign:'left', lineHeight: '1.5rem', width: '100%' }}>{project.description}</p>
            <HorizontallyFlexSpaceBetweenContainer style={{ fontSize: '90%', textAlign: 'left' }}>
              <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px' }}>
                <p>Create on: <span style={{ color: '#97cadb', textAlign: 'left' }}>{new Date(project.creationDate).toLocaleString()}</span></p>
                <p>Start Date: <span style={{ color: '#97cadb', textAlign: 'left' }}>{new Date(project.startDate).toLocaleString()}</span></p>
                <p>Estimated end date: <span style={{ color: '#97cadb', textAlign: 'left' }}>{new Date(project.estimatedEndDate).toLocaleString()}</span></p>
                <p>End date: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.endDate && new Date(project.endDate).toLocaleString()}</span></p>
                <p>Type: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.projectType}</span></p>
              </VerticallyFlexGapContainer>
              <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px' }}>
                <p>Status: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.status}</span></p>
                <p>Country: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.country}</span></p>
                <p>Location: <span style={{ color: '#97cadb', textAlign: 'left' }}>{`${project.city}, ${project.district}, ${project.sector}, ${project.address}`}</span></p>
                <p>Manager: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.ownerName}</span></p>
                <p>Progress: <span style={{ color: '#97cadb', textAlign: 'left' }}>{project.progress} %</span></p>
              </VerticallyFlexGapContainer>
            </HorizontallyFlexSpaceBetweenContainer>
            <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
              <Button variant="contained" color="success" size="small" type="button" onClick={() => { setOpenAddManagerForm(!openAddManagerForm) }}><PersonIcon /> Add Manager</Button>
              <Button variant="contained" color="primary" size="small" type="button" onClick={() => {navigate(`/${project.code}/resources`)}}><Soundss ProtionIcon /> Add / View Resources</Button>
              <Button variant="contained" color="secondary" size="small" type=" button" onClick={() => {navigate(`/${project.code}/activities`)}}><SportsScoreIcon /> Add Millestones</Button>
            </HorizontallyFlexGapContainer>
          </VerticallyFlexGapContainer>
        }
      </VerticallyFlexGapContainer>
      
      <VerticallyFlexGapContainer>
        {openAddManagerForm && 
          <VerticallyFlexGapForm onSubmit={handleSubmit(onSubmit)} style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
            <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>Add Manager</HeaderTwo>
            <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'center' }}>
              <FormElement style={{ color: '#97cadb' }}>
                <label htmlFor="ownerName">Name</label>
                <input 
                  type="text" 
                  id="ownerName"
                  placeholder="Manager name" 
                  {...register("ownerName", 
                  {required: true})} 
                  aria-invalid={errors.ownerName ? "true" : "false"}
                />
                {errors.ownerName?.type === "required" && (
                  <p role="alert">Manager name is required</p>
                )}
              </FormElement>
              <FormElement style={{ color: '#97cadb' }}>
                <label htmlFor="ownerEmail">Email</label>
                <input 
                  type="email" 
                  id="ownerEmail"
                  placeholder="Manager email address" 
                  {...register("ownerEmail", 
                  {required: true})} 
                  aria-invalid={errors.ownerEmail ? "true" : "false"}
                />
                {errors.ownerEmail?.type === "required" && (
                  <p role="alert">Manager email is required</p>
                )}
              </FormElement>
              <FormElement style={{ width: '20%' }}>
                {isProcessing 
                  ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
                  : <Button variant="contained" color="primary" size="small" type="submit">Add</Button>
                }
              </FormElement>
            </HorizontallyFlexGapContainer>
          </VerticallyFlexGapForm>
        }
      </VerticallyFlexGapContainer>
    </VerticallyFlexGapContainer>
  )
}

export default EditProject