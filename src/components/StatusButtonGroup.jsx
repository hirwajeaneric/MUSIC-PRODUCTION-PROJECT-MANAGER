/* eslint-disable react/prop-types */
import axios from 'axios';
import { useContext } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { GeneralContext } from '../App';
import { StatusButtonGroupContainer } from './styles/GenericStyles';
import { getIssueSprints } from '../redux/features/sprintSlice';
import { getProjectIssues } from '../redux/features/issueSlice';
import { getAllProjects } from '../redux/features/projectSlice';
import { useCookies } from 'react-cookie';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const StatusButtonGroup = (props) => {
    // eslint-disable-next-line react/prop-types
    const { type, data } = props;
    const { setOpen, setResponseMessage, handleOpenModal } = useContext(GeneralContext);
    const dispatch = useDispatch();
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;
    

    // Update issue 
    const update = (updates) => {
        console.log(updates);
        
        axios.put(`${serverUrl}/api/v1/mppms/${type}/update?id=${data._id}`, updates)
        .then(response => {
            if (response.status === 200) {
                if (type==='sprint') {
                    dispatch(getIssueSprints(response.data.sprint.issue));
                }
                console.log('sprint passed');
                if (type==='issue') {
                    dispatch(getProjectIssues(response.data.issue.project));
                    console.log(user.id);
                    dispatch(getAllProjects(user.id));
                }
                console.log('sprint passed');

                handleOpenModal(); 
                setResponseMessage({ message: response.data.message, severity: 'success' });
                setOpen(true);
            }
        })
        .catch(error => {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            setResponseMessage({ message: error.response.data.msg, severity:'error'})
            setOpen(true);
        }
        })
    };

    return (      
        <StatusButtonGroupContainer>
            <button 
                type='button'
                onClick={(e) => {
                    e.preventDefault();
                    update({ progress: 'Todo' });
                }} 
                style={{ 
                    background: data.progress === 'Todo' ? 'green' : '#e6f2ff', 
                    color: data.progress === 'Todo' ? 'white' : 'black'        
                }}>
                    Todo
                    {data.progress === 'Todo' && <AiOutlineCheckCircle />}
            </button>
            <button 
                type='button'
                onClick={(e) => {
                    e.preventDefault();
                    update({ progress: 'In Progress' });
                }}  
                style={{ 
                    background: data.progress === 'In Progress' ? 'green' : '#e6f2ff', 
                    color: data.progress === 'In Progress' ? 'white' : 'black'
                }}>
                    In Progress
                    {data.progress === 'In Progress' && <AiOutlineCheckCircle />}
            </button>
            <button 
                type='button'
                onClick={(e) => {
                    e.preventDefault();
                    update({ progress: 'Completed' });
                }}  
                style={{ 
                    background: data.progress === 'Completed' ? 'green' : '#e6f2ff', 
                    color: data.progress === 'Completed' ? 'white' : 'black'
                }}>
                    Completed
                    {data.progress === 'Completed' && <AiOutlineCheckCircle />}
            </button>
        </StatusButtonGroupContainer>
    )
}

export default StatusButtonGroup