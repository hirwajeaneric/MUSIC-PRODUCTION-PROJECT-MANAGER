import {  Button } from "@mui/material";
import axios from "axios";
import { Fragment, useContext, useState } from "react";
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
  const [ projectUsers, setProjectUsers ] = useState([]);
  
  // Fetching project 
  useEffect(() => {
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then((response) => {
      setProject(response.data.project);
      setProjectUsers(response.data.project.users);
    })
    .catch(error => console.log(error))
  },[params.code]);

  const sendEmail = (email) => {
    axios.post(`${serverUrl}/api/v1/mppms/email/`, email)
  }

  // Adding user function 
  const onSubmit = data => {
    setIsProcessing(true);

    console.log(data);

    // 1. Adding user or creating new one 
    axios.post(`${serverUrl}/api/v1/mppms/user/add`, data)
    .then(response => {
      if (response.status === 201) {
        var userInfo = response.data.user;
        console.log("User info: ");
        console.log(userInfo);
        
        // 2. Adding user to project 
        const userIsAlreadyInProject = project.users.find(element => element.id === response.data.user.id);
        if (userIsAlreadyInProject) {
          setIsProcessing(false);
          setResponseMessage({ message: 'User already in project', severity:'error'})
          setOpen(true);
        }
        project.users.push(response.data.user);

        axios.put(`${serverUrl}/api/v1/mppms/project/update?id=${project._id}`, project)
        .then(response => {
            if (response.status === 200) {
              sendEmail({
                email: data.email, 
                subject: 'You have been added to a Soundss Pro Project', 
                text: `Dear ${userInfo.fullName}, \nBellow are your account credentials: \n\nEmail: ${userInfo.email} \nPassword: ${userInfo.password || 'Your password'}. \n\nClick on the link bellow to view more about the project: \nhttp://localhost:5000/${project.code} \n\nBest regards,`
              });
              
              setIsProcessing(false);
              setResponseMessage({ message: 'User added', severity: 'success' });
              setOpen(true);
              setTimeout(() => { window.location.reload() }, 2000);
            }
        })
        .catch(error => {
          if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            setIsProcessing(false);
            setResponseMessage({ message: error.response.data.msg, severity:'error'})
            setOpen(true);
          }
        })
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

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`Project details - ${project.name}`}</title>
        <meta name="description" content={`A list of both my projects and projects I manage.`} /> 
      </Helmet>
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        {isLoading ? <p style={{ color: 'white' }}>Loading...</p> :
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
                {user.role === 'Producer' && <Button 
                  variant='contained' 
                  size='small' 
                  color='primary' 
                  onClick={() => { 
                    handleOpenModal(); 
                    setDetailsFormType('project');
                    setDetailsData(project);
                  }}>
                    Project Info
                </Button>}
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
                {user.role !== 'Producer' && <p>Producer: <span style={{ color: 'white', textAlign: 'left' }}>{project.producerName}</span></p>}
                <p>Users: 
                  <span style={{ color: 'white', textAlign: 'left' }}>
                    {projectUsers.length !== 0 && projectUsers.map((element, index) => {
                      return (
                        <Fragment key={index}>{" "+element.fullName+" ("+element.role+"), "}</Fragment>
                      )
                    })}
                  </span>
                </p>
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
              {user.role !== 'Producer' && 
                <>
                  <Button variant="contained" color="secondary" size="small" type=" button" onClick={() => {navigate(`/${project.code}/milestones`)}}><SportsScoreIcon />View Progress</Button>
                </>
              }
            </HorizontallyFlexGapContainer>
          </VerticallyFlexGapContainer>
        }
      </VerticallyFlexGapContainer>
      <VerticallyFlexGapContainer>
        {openAddManagerForm && 
          <VerticallyFlexGapForm onSubmit={handleSubmit(onSubmit)} style={{ gap: '20px', background: '#02457a', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
            <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>Add Users</HeaderTwo>
            <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'center' }}>
              <FormElement style={{ color: 'white' }}>
                <label htmlFor="fullName">Name</label>
                <input 
                  type="text" 
                  id="fullName"
                  placeholder="User's name" 
                  {...register("fullName", 
                  {required: true})} 
                  aria-invalid={errors.fullName ? "true" : "false"}
                />
                {errors.fullName?.type === "required" && (
                  <p role="alert">User full name is required</p>
                )}
              </FormElement>
              <FormElement style={{ color: 'white' }}>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="Email address" 
                  {...register("email", 
                  {required: true})} 
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email?.type === "required" && (
                  <p role="alert">Email is required</p>
                )}
              </FormElement>
              <FormElement style={{ color: 'white' }}>
                <label htmlFor="role">Role</label>
                <select 
                  {...register("role", { required: true })}
                  aria-invalid={errors.role ? "true" : "false"}
                >
                  <option value="">Choose role</option>
                  <option value="Artist">Artist</option>
                  <option value="Manager">Manager</option>
                </select>
                {errors.role?.type === "required" && (
                  <p role="alert">Role is required</p>
                )}
              </FormElement>
            </HorizontallyFlexGapContainer>  
            <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'center' }}>
              <FormElement style={{ color: 'white' }}>
                  <label htmlFor="group">Group name</label>
                  <input 
                    type="group" 
                    id="group"
                    placeholder="Group name" 
                    {...register("group", 
                    {required: false})} 
                  />
                </FormElement>
                <FormElement style={{ color: 'white' }}>
                  <label htmlFor="password">Password</label>
                  <input 
                    type="text" 
                    id="password"
                    placeholder="Password" 
                    {...register("password", 
                    {required: true})} 
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password?.type === "required" && (
                    <p role="alert">Password is required</p>
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

export default ProjectDetails