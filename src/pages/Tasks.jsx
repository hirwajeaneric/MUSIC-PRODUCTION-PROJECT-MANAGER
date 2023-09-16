import { Avatar, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreateProjectForm from "../components/forms/CreateProjectForm";
import { ProjectProgressBar } from "../components/styles/DashboardStructureStyles";
import { HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from "../components/styles/GenericStyles";
import { getSimpleCapitalizedChars } from "../utils/HelperFunctions";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import PersonIcon from '@mui/icons-material/Person';
import MusicIcon from '@mui/icons-material/MusicNote';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

const Tasks = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoading, listOfConsultantsProjects, listOfOwnerProjects } = useSelector(state => state.project);
  const [project, setProject] = useState({});

  useEffect(() => {
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then((response) => {
      setProject(response.data.project)
    })
    .catch(error => console.log(error))
  },[]);

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`${project.code} - Project details`}</title>
        <meta name="description" content={`A list of both my projects and projects I manage.`} /> 
      </Helmet>
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        <VerticallyFlexGapContainer style={{ gap: '20px'}}>
          <HorizontallyFlexGapContainer style={{ borderBottom: '1px solid #a3c2c2', paddingBottom: '10px' }}>
            <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>{project.name}</HeaderTwo>
            <p style={{ color: '#97cadb' }}>{project.code}</p>
          </HorizontallyFlexGapContainer>
        </VerticallyFlexGapContainer>
      </VerticallyFlexGapContainer>
      <HorizontallyFlexSpaceBetweenContainer>
          <VerticallyFlexGapForm style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>

          </VerticallyFlexGapForm>
          <VerticallyFlexGapForm style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>

          </VerticallyFlexGapForm>
          <VerticallyFlexGapForm style={{ gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>

          </VerticallyFlexGapForm>
        </HorizontallyFlexSpaceBetweenContainer>
    </VerticallyFlexGapContainer>
  )
}

export default Tasks