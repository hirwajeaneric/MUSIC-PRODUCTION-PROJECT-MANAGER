import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Auth from './pages/auth/Auth';
import DashboardMain from './pages/DashboardMain';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ResponseComponent from './components/ResponseComponent';
import { useDispatch } from 'react-redux';
import { getAllProjects } from './redux/features/projectSlice';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import ProjectMaterials from './pages/ProjectMaterials';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import ResourcesDetails from './components/forms/ResourcesDetails';
import IssueDetails from './components/forms/IssueDetails';
// import SprintDetails from './components/forms/SprintDetails';
import MoreProjectDetails from './components/forms/MoreProjectDetails';
import MileStones from './pages/MileStones';

const style = {
  position: 'absolute',
  top: '0px',
  right: '0px',
  width: '40%',
  bgcolor: '#02457a',
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 1,
  overflowY: 'auto',
  height: '100vh'
};

export const GeneralContext = createContext();

function App() {
  const dispatch = useDispatch();
  const [responseMessage, setResponseMessage] = useState({ message: '', severity: ''});
  const [open, setOpen] = useState(false);
  const [ cookies ] = useCookies(null);
  const authToken = cookies.AuthToken;
  const user = cookies.UserData;
  const [detailsFormType, setDetailsFormType] = useState('');
  const [detailsData, setDetailsData] = useState({});
  const [sprintDetails, setSprintDetails] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(!openModal);
  const handleCloseModal = () => setOpenModal(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {  
    if (user !== undefined) {
      dispatch(getAllProjects({id: user.id, role: user.role}));
    }
  },[dispatch, user]);

  return (
    <GeneralContext.Provider 
      value={{
        setOpen, 
        responseMessage, 
        setResponseMessage, 
        handleOpenModal, 
        setDetailsFormType,
        detailsFormType,
        setDetailsData, 
        detailsData, 
        sprintDetails,
        setSprintDetails,
        selectedMaterial,
        setSelectedMaterial
      }}>
      <BrowserRouter>
        <Routes>
          
          <Route path='/auth/' element={<Auth />}>
            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password/:token/:userId' element={<ResetPassword />} />
          </Route>

          <Route path='/' element={authToken ? <DashboardMain /> : <Navigate replace to={'/auth/signin'} />}>
            <Route path='' element={<Home />} />
            <Route path='projects' element={<Project />} />
            <Route path='/:code' element={<ProjectDetails />} />
            <Route path='/:code/activities' element={<Tasks />} />
            <Route path='/:code/resources' element={<ProjectMaterials />} />
            <Route path='/:code/milestones' element={<MileStones />} />
            <Route path='/:code/report-preview' element={<Reports />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Multi-purpose modal  */}
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {/* Resource Modal Display  */}
          {detailsFormType === 'project' && <MoreProjectDetails data={detailsData}/>}
          {/* Resource Modal Display  */}
          {detailsFormType === 'resource' && <ResourcesDetails data={detailsData}/>}
          {/* Issue details display  */}
          {detailsFormType === 'issue' && <IssueDetails data={detailsData}/>}
        </Box>
      </Modal>


      {/* RESPONSE MESSAGE DISPLAYER ****************************************************************************************************************************** */}
      <ResponseComponent 
        message={responseMessage.message} 
        severity={responseMessage.severity}
        open={open} 
        handleClose={handleClose} 
      />
    </GeneralContext.Provider>
  )
}

export default App
