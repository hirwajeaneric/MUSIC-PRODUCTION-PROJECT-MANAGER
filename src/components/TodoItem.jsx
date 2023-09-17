/* eslint-disable react/prop-types */
import { Fragment, useContext, useState } from 'react';
import { HorizontallyFlexGapContainer } from './styles/GenericStyles';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MdOutlineCircle } from 'react-icons/md';
import { GeneralContext } from '../App';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getProjectIssues } from '../redux/features/issueSlice';
import { getIssueSprints } from '../redux/features/sprintSlice';
import { Box, Button, Modal } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SprintDetails from './forms/SprintDetails';
import { getAllProjects } from '../redux/features/projectSlice';
import { useCookies } from 'react-cookie';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const generalStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: '#d6e8ee',
    border: '1px solid white',
    borderRadius: '5px'
}

const checkButtonStyles = {
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: '5px',
    fontSize: '150%',
    color: '#0066cc'
}

const nameStyles = {
    width: '100%',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '100%',
}

const sprintNameStyles = {
    width: '100%',
    textAlign: 'left',
    fontSize: '100%',
    color: 'black'
}

export default function TodoItem(props) {
    const { type, data } = props;
    const { setOpen, setResponseMessage,handleOpenModal, setDetailsFormType, setDetailsData } = useContext(GeneralContext);
    const dispatch = useDispatch();
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const viewIssueDetails = () => {
        handleOpenModal(); 
        setDetailsFormType(type);
        setDetailsData(data);
    }

    const updateIssueProgress = (e) => {
        e.preventDefault();

        var progress = '';
        if (data.progress === 'Todo') {
            progress = 'Completed';
        } else {
            progress = 'Todo'
        }

        axios.put(`${serverUrl}/api/v1/mppms/${type}/update?id=${data.id}`, { progress : progress })
        .then(response => {
            if (response.status === 200) {
                if (type === 'issue') {
                    dispatch(getProjectIssues(response.data.issue.project));
                    dispatch(getAllProjects(user.id));
                } else if (type === 'sprint') {
                    dispatch(getIssueSprints(response.data.sprint.issue));
                }
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
    }

    return (
        <HorizontallyFlexGapContainer style={generalStyles}>
            <button type='button' disabled={user.role !== 'Producer' && true} onClick={updateIssueProgress} style={checkButtonStyles}>{(data.progress=== 'Todo' || data.progress=== 'In Progress') ? <MdOutlineCircle /> : <AiFillCheckCircle />}</button>
            {type === 'issue' && <button type='button' onClick={viewIssueDetails} style={nameStyles}>{data.name}</button>}
            {type === 'sprint' && <p style={sprintNameStyles}>{data.name}</p>}
            {type === 'sprint' && <ChildModal sprint={data} />}
        </HorizontallyFlexGapContainer>
    )
}


// Styles for the child model -> SPRINT DETAILS
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: '#02457a',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 4,
    overflowY: 'auto',
    height: '80vh',
};
  
// SPRINT DETAILS MODEL
function ChildModal(props) {
    const { sprint } = props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Fragment>
        <Button onClick={handleOpen}><MoreHorizIcon /></Button>
        <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
          <Box sx={style}>
            <SprintDetails data={sprint}/>
          </Box>
        </Modal>
      </Fragment>
    );
}
  