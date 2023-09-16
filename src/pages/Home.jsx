import { Avatar, Button, Tooltip } from "@mui/material"
import { HeaderOne, HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import AddIcon from '@mui/icons-material/Add';
import { ProjectProgressBar, StepToGetStarted } from "../components/styles/DashboardStructureStyles";
import MusicIcon from '@mui/icons-material/MusicNote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { getSimpleCapitalizedChars } from "../utils/HelperFunctions";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Home = () => {
  const navigate = useNavigate();
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;

  const { isLoading, listOfProducersProjects, listOfManagerProjects } = useSelector(state => state.project);

  return (
    <VerticallyFlexGapContainer style={{ gap: '15px' }}>
      <Helmet>
        <title>Dashboard - Home</title>
        <meta name="description" content={`Welcome to your user dashboard.`} /> 
      </Helmet>

      {/* First dashboard section  */}
      <VerticallyFlexGapContainer style={{ gap: '40px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        <HorizontallyFlexSpaceBetweenContainer>
          <div className="left49width" style={{ flexDirection: 'column'}}>
            <HeaderOne style={{ color: '#d6e8ee' }}>{`Welcome ${user.fullName}`}</HeaderOne>
            {user.role === 'Producer' && <p style={{ color: '#b1cdcd'}}>Here are some quick steps to get you started</p>}
            {user.role === 'Manager' && <p style={{ color: '#476b6b'}}>Get overview of your projects</p>}
          </div>
          {user.role === 'Producer' && <div className="right49width" style={{ justifyContent: "flex-end" }}>
            <Button variant="contained" color='info' startIcon={<AddIcon />} onClick={() => navigate('projects')}>Create Project</Button>
          </div>}
        </HorizontallyFlexSpaceBetweenContainer>
        {user.role === 'Producer' && <HorizontallyFlexSpaceBetweenContainer>
          <div className="left49width" style={{ gap: '15px', flexDirection: 'column'}}>
            <StepToGetStarted>
              <AddIcon style={{ color: 'green' }}/>
              <div>
                <p>Create a project</p>
                <span>Add all necessary information</span>
              </div>
            </StepToGetStarted>
            <StepToGetStarted>
              <MusicIcon style={{ color: 'blue' }}/>
              <div>
                <p>Add project resources</p>
                <span>Provide all estimated project resources and cost estimations</span>
              </div>
            </StepToGetStarted>
          </div>
          <div className="right49width" style={{ gap: '15px', flexDirection: 'column'}}>
            <StepToGetStarted>
              <FormatListBulletedIcon style={{ color: 'orange' }}/>
              <div>
                <p>Create phases</p>
                <span>Name phases of the project and their respective durations</span>
              </div>
            </StepToGetStarted>
            <StepToGetStarted>
              <PlaylistAddCheckIcon style={{ color: '#4da6ff' }}/>
              <div>
                <p>Provide sub-activities for phases</p>
                <span>Make phases manageable by sub dividing them into further smaller activities.</span>
              </div>
            </StepToGetStarted>
          </div>
        </HorizontallyFlexSpaceBetweenContainer>}
      </VerticallyFlexGapContainer>

      {/* Second dashboard section  */}
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        
        <HorizontallyFlexSpaceBetweenContainer style={{ borderBottom: '1px solid #b3d9ff', paddingBottom: '15px'}}>
          <p style={{ fontWeight: '600', color: '#d6e8ee' }}>Projects</p>
        </HorizontallyFlexSpaceBetweenContainer>

        <VerticallyFlexGapContainer style={{ gap: '10px' }}>
          {isLoading ? 
          <p style={{ color: '#97cadb' }}>Loading...</p> :
          <>
            {(listOfProducersProjects.length === 0 && listOfManagerProjects.length === 0) && <p style={{ color: '#b1cdcd' }}>No available projects yet</p>}
            {listOfManagerProjects && listOfManagerProjects.map((project, index) => (
              <HorizontallyFlexGapContainer key={index}>
                <div style={{ width: '5%' }}>
                  <Avatar style={{ border: '2px solid #2c7be4', background: 'black' }}>PI</Avatar>
                </div>
                <VerticallyFlexGapContainer style={{ borderBottom: '1px solid #b3d9ff', paddingBottom: '10px', width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '5px' }}>
                  <HorizontallyFlexSpaceBetweenContainer style={{ width: '100%'}}>
                    <HeaderTwo style={{ width:'70%', color: '#2c7be4' }}>{`Project ${project.name}`}</HeaderTwo>
                    <HorizontallyFlexGapContainer style={{ width:'30%', gap: '40px', justifyContent:'flex-end' }}>
                      <Tooltip title='View more'>
                        <Button variant="text" color="primary" size="small" type="button" onClick={(e) => { e.preventDefault(); navigate(`/${project.code}`)}}><MoreHorizIcon /></Button>
                      </Tooltip>
                    </HorizontallyFlexGapContainer>
                  </HorizontallyFlexSpaceBetweenContainer>
                  <p style={{ fontSize: '90%', color: '#97cadb' }}>{project.description}</p>
                  <ProjectProgressBar>
                    <div style={{ width: `${project.progress.toFixed(1)}%`}}>
                        {project.progress !== 0 && <p>{`${project.progress.toFixed(1)}%`}</p>}
                    </div>
                    {project.progress === 0 && <p>{`${project.progress.toFixed(1)}%`}</p>}
                </ProjectProgressBar>
                </VerticallyFlexGapContainer>
              </HorizontallyFlexGapContainer>
            ))}

            {listOfProducersProjects && listOfProducersProjects.map((project, index) => (
              <HorizontallyFlexGapContainer key={index}>
                <div style={{ width: '5%' }}>
                  <Avatar style={{ border: '2px solid #2c7be4', background: 'black' }}>{getSimpleCapitalizedChars(project.name)}</Avatar>
                </div>
                <VerticallyFlexGapContainer style={{ borderBottom: '1px solid #b3d9ff', paddingBottom: '10px', width: '95%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '5px' }}>
                  <HorizontallyFlexSpaceBetweenContainer style={{ width: '100%'}}>
                    <HeaderTwo style={{ width:'70%', color: '#2c7be4'}}>{`Project ${project.name}`}</HeaderTwo>
                    <HorizontallyFlexGapContainer style={{ width:'30%', gap: '40px', justifyContent:'flex-end' }}>
                      <Tooltip title='View more'>
                        <Button variant="text" color="primary" size="small" type="button" onClick={() => {navigate(`/${project.code}`)}}><MoreHorizIcon /></Button>
                      </Tooltip>
                    </HorizontallyFlexGapContainer>
                  </HorizontallyFlexSpaceBetweenContainer>
                  <p style={{ fontSize: '90%', color: '#97cadb' }}>{project.description}</p>
                  <ProjectProgressBar>
                    <div style={{ width: `${project.progress.toFixed(1)}%`}}>
                        {project.progress !== 0 && <p>{`${project.progress.toFixed(1)}%`}</p>}
                    </div>
                    {project.progress === 0 && <p>{`${project.progress.toFixed(1)}%`}</p>}
                  </ProjectProgressBar>
                </VerticallyFlexGapContainer>
              </HorizontallyFlexGapContainer>
            ))}
          </>}
        </VerticallyFlexGapContainer>
      </VerticallyFlexGapContainer>

    </VerticallyFlexGapContainer>
  )
}

export default Home