import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import CreateProjectForm from "../components/forms/CreateProjectForm";
import { HeaderTwo, HorizontallyFlexGapContainer, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import ProjectItem from "../components/ProjectItem";
import { useCookies } from "react-cookie";

const Project = () => {
  const { isLoading, listOfProducersProjects, listOfUserProjects, numberOfProjects } = useSelector(state => state.project);
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>My projects - A list of both my projects and projects I manage</title>
        <meta name="description" content={`A list of both my projects and projects I manage.`} /> 
      </Helmet>

      <HeaderTwo style={{ width: '100%', textAlign: 'left', color: '#d6e8ee' }}>My Projects</HeaderTwo>
      
      <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'flex-start'}}>
        {/* List of projects  */}
        <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#02457a', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
          <VerticallyFlexGapContainer>
            {isLoading ? 
            <p style={{ color: '#97cadb' }}>Loading...</p> :
            <>
              {/* Common user projects  */}
              {numberOfProjects === 0 && <p style={{ color: '#b1cdcd' }}>No available projects yet</p>}
              
              {listOfUserProjects && listOfUserProjects.map((project, index) => (
                <ProjectItem key={index} project={project} />
              ))}

              {/* Producer projects  */}
              {listOfProducersProjects && listOfProducersProjects.map((project, index) => (
                <ProjectItem key={index} project={project} />
              ))}
              
            </>}
          </VerticallyFlexGapContainer>
        </VerticallyFlexGapContainer>

        {/* Create project form  */}
        {user.role === 'Producer' && <CreateProjectForm />}
      </HorizontallyFlexGapContainer>

    </VerticallyFlexGapContainer>
  )
}

export default Project