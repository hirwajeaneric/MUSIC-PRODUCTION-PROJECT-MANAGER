import { Avatar, Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, ProjectItemContainer, VerticallyFlexGapContainer } from './styles/GenericStyles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSimpleCapitalizedChars } from '../utils/HelperFunctions';
import { ProjectProgressBar } from './styles/DashboardStructureStyles';
import axios from "axios";
import { useContext, useState } from "react";
import { GeneralContext } from "../App";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const ProjectItem = ({ project }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const { setOpen, setResponseMessage } = useContext(GeneralContext);

    const deleteProject = (projectId) => {
        setIsProcessing(true);
        axios.delete(serverUrl+'/api/v1/mppms/project/delete?id='+projectId)
        .then(response => {
        setTimeout(() => {
            if (response.status === 200) {
            setIsProcessing(false);
            setResponseMessage({ message: response.data.message, severity: 'success' });
            setOpen(true);
            window.location.reload(); 
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
    return (
        <ProjectItemContainer>
            <div className='avatar-container'>
                <Avatar style={{ border: '2px solid white', background: 'black' }}>{getSimpleCapitalizedChars(project.name)}</Avatar>
            </div>
            <VerticallyFlexGapContainer style={{ width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                <HorizontallyFlexSpaceBetweenContainer style={{ width: '100%'}}>
                    <HeaderTwo style={{ width:'50%', color: '#d6e8ee'}}>{project.name}</HeaderTwo>
                    <HorizontallyFlexGapContainer style={{ width:'50%', gap: '40px', justifyContent:'flex-end' }}>
                        <Button variant="contained" color="primary" size="small" type="button" onClick={(e) => {navigate(`/${project.code}`)}}>View more</Button>
                        {isProcessing 
                        ? <Button disabled variant="text" color="primary" size="small">PROCESSING...</Button> 
                        : <Button variant="contained" color="error" size="small" type="button" onClick={(e) => {e.preventDefault(); deleteProject(project.id);}}>Delete</Button>
                        }
                    </HorizontallyFlexGapContainer>
                </HorizontallyFlexSpaceBetweenContainer>
                <p style={{ fontSize: '90%', color: '#97cadb' }}>{project.description}</p>
                <ProjectProgressBar>
                    <div style={{ width: `${project.progress.toFixed(1)}%`}}>
                        {project.progress !== 0 && <p>{`${project.progress.toFixed(1)}%`}</p>}
                    </div>
                    {project.progress === 0 && <p>{`${project.progress}%`}</p>}
                </ProjectProgressBar>
            </VerticallyFlexGapContainer>
        </ProjectItemContainer>
    )
}

export default ProjectItem