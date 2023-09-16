import {  Button } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../components/styles/GenericStyles"
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import PersonIcon from '@mui/icons-material/Person';
import MusicIcon from '@mui/icons-material/MusicNote';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useForm } from "react-hook-form";
import { GeneralContext } from "../App";
import { useCookies } from "react-cookie";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoading } = useSelector(state => state.project);
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;

  const [ openAddManagerForm, setOpenAddManagerForm ] = useState(false);
  const { setOpen, setResponseMessage, handleOpenModal, setDetailsFormType, setDetailsData } = useContext(GeneralContext);
  const [ isProcessing, setIsProcessing ] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ project, setProject ] = useState({});
  
  // Fetching project 
  useEffect(() => {
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then((response) => {
      setProject(response.data.project)
    })
    .catch(error => console.log(error))
  },[params.code]);

  const sendEmail = (email) => {
    axios.post(`${serverUrl}/api/v1/mppms/email/`, email)
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
        <title>{`Project details - ${project.name}`}</title>
        <meta name="description" content={`A list of both my projects and projects I manage.`} /> 
      </Helmet>
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        {isLoading ? <p>Loading...</p> :
          <VerticallyFlexGapContainer style={{ gap: '20px'}}>
            
            <HorizontallyFlexGapContainer style={{ borderBottom: '1px solid #a3c2c2', paddingBottom: '10px' }}>
              <HeaderTwo style={{ width: '100%', textAlign: 'left', color: '#d6e8ee' }}>{project.name}</HeaderTwo>
              
              <HorizontallyFlexGapContainer style={{ gap: '20px', justifyContent: 'flex-end' }}>
                <p style={{ color: '#d6e8ee' }}>Code: <span style={{ color: 'white' }}>{project.code}</span></p>
                <Button 
                  variant='contained' 
                  size='small' 
                  color='inherit' 
                  onClick={() => { 
                    navigate(`/${params.code}/report-preview`);
                  }}>
                    Report preview
                </Button>
                <Button 
                  variant='contained' 
                  size='small' 
                  color='primary' 
                  onClick={() => { 
                    handleOpenModal(); 
                    setDetailsFormType('project');
                    setDetailsData(project);
                  }}>
                    Project Info
                </Button>
              </HorizontallyFlexGapContainer>
            </HorizontallyFlexGapContainer>

            <p style={{ color: 'white', textAlign:'left', lineHeight: '1.5rem', width: '100%' }}>{project.description}</p>
            <HorizontallyFlexSpaceBetweenContainer style={{ fontSize: '90%', textAlign: 'left' }}>
              <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px', color: '#d6e8ee' }}>
                <p>Create on: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(project.creationDate).toLocaleString()}</span></p>
                <p>Start Date: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(project.startDate).toLocaleString()}</span></p>
                <p>Estimated end date: <span style={{ color: 'white', textAlign: 'left' }}>{new Date(project.estimatedEndDate).toLocaleString()}</span></p>
                <p>End date: <span style={{ color: 'white', textAlign: 'left' }}>{project.endDate && new Date(project.endDate).toLocaleString()}</span></p>
                <p>Type: <span style={{ color: 'white', textAlign: 'left' }}>{project.projectType}</span></p>
              </VerticallyFlexGapContainer>
              <VerticallyFlexGapContainer style={{ alignItems: 'flex-start', gap: '10px', color: '#d6e8ee' }}>
                <p>Status: <span style={{ color: 'white', textAlign: 'left' }}>{project.status}</span></p>
                <p>Country: <span style={{ color: 'white', textAlign: 'left' }}>{project.country}</span></p>
                <p>Location: <span style={{ color: 'white', textAlign: 'left' }}>{`${project.city}, ${project.district}, ${project.sector}, ${project.address}`}</span></p>
                <p>Manager: <span style={{ color: 'white', textAlign: 'left' }}>{project.ownerName}</span></p>
                <p>Progress: <span style={{ color: 'white', textAlign: 'left' }}>{`${Math.round(project.progress * 10) / 10} %`}</span></p>
              </VerticallyFlexGapContainer>
            </HorizontallyFlexSpaceBetweenContainer>
            <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
              {user.role === 'Producer' && <Button variant="contained" color="success" size="small" type="button" onClick={() => { setOpenAddManagerForm(!openAddManagerForm) }}><PersonIcon /> Add Users</Button>}
              {user.role === 'Producer' && 
                <>
                  <Button variant="contained" color="primary" size="small" type="button" onClick={() => {navigate(`/${project.code}/resources`)}}><MusicIcon /> Add / View Resources</Button>
                  <Button variant="contained" color="secondary" size="small" type=" button" onClick={() => {navigate(`/${project.code}/milestones`)}}><SportsScoreIcon /> Add / View Millestones</Button>
                </>
              }
              {user.role === 'Manager' && 
                <>
                  <Button variant="contained" color="primary" size="small" type="button" onClick={() => {navigate(`/${project.code}/resources`)}}><MusicIcon />View Resources</Button>
                  <Button variant="contained" color="secondary" size="small" type=" button" onClick={() => {navigate(`/${project.code}/milestones`)}}><SportsScoreIcon />View Millestones</Button>
                </>
              }
            </HorizontallyFlexGapContainer>
          </VerticallyFlexGapContainer>
        }
      </VerticallyFlexGapContainer>
      <VerticallyFlexGapContainer>
        {openAddManagerForm && 
          <VerticallyFlexGapForm onSubmit={handleSubmit(onSubmit)} style={{ gap: '20px', background: '#02457a', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
            <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>Add Users</HeaderTwo>
            <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'center' }}>
              <FormElement style={{ color: 'white' }}>
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
                  <p role="alert">User name is required</p>
                )}
              </FormElement>
              <FormElement style={{ color: 'white' }}>
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
                  <p role="alert">User email is required</p>
                )}
              </FormElement>
              {/* <FormElement style={{ color: 'white' }}>
                <label htmlFor="role">Role</label>
                <select 
                  {...register("role", { required: true })}
                  aria-invalid={errors.role ? "true" : "false"}
                >
                  <option value="">Choose role</option>
                  <option value="Stakeholder">Stakeholder</option>
                  <option value="Manager">Manager</option>
                </select>
                {errors.role?.type === "required" && (
                  <p role="alert">Role is required</p>
                )}
              </FormElement> */}
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

export default ProjectDetails