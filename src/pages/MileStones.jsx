import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { HeaderTwo, HorizontallyFlexGapContainer, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexSpaceBetweenForm } from "../components/styles/GenericStyles"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GeneralContext } from "../App";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { getProjectIssues } from "../redux/features/issueSlice";
import TodoItem from "../components/TodoItem";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const MileStones = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { setOpen, setResponseMessage, handleOpenModal, setDetailsFormType, setDetailsData } = useContext(GeneralContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [project, setProject] = useState({});
    const [issue, setIssue] = useState({});
    

    // Fetching project 
    useEffect(() => {
        axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
        .then((response) => {
            setProject(response.data.project);
            dispatch(getProjectIssues(response.data.project._id));
        })
        .catch(error => console.log(error))
    },[dispatch, params.code]);

    const { 
        numberOfProjectIssues, 
        listOfTodoIssues, 
        listOfInProgressIssues, 
        listOfCompletedIssues, 
        numberOfTodoIssues, 
        numberOfInProgressIssues, 
        numberOfCompletedIssues 
    } = useSelector(state => state.issue);

    const { isLoading: loadingProject } = useSelector(state => state.project);

    const handleInput = ({ currentTarget: input }) => {
        setIssue({ ...issue, [input.name]: input.value });
    }

    const addIssue = (e) => {
        e.preventDefault();

        issue.number = numberOfProjectIssues+1;
        issue.project = project._id;

        setIsProcessing(true);
    
        axios.post(serverUrl+'/api/v1/mppms/issue/add', issue)
        .then(response => {
            if (response.status === 201) {
                setIsProcessing(false);
                setIssue({});
                setResponseMessage({ message: response.data.message, severity: 'success' });
                setOpen(true);
                dispatch(getProjectIssues(project._id));
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

    const displayProjectInfo = () => {
        handleOpenModal(); 
        setDetailsFormType('project');
        setDetailsData(project);
    }

    return (
        <VerticallyFlexGapContainer style={{ gap: '20px'}}>
            <Helmet>
                <title>{`Milestones - ${project.name}`}</title>
                <meta name="description" content={`A list of all issuess associated to this project and a form to add more.`} /> 
            </Helmet>

            <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#132239', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
                {loadingProject ? <p style={{ width: '100%', textAlign: 'left' }}>Loading...</p> :
                <HorizontallyFlexSpaceBetweenContainer>
                    <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>{`${project.name} major Phases`}</HeaderTwo>
                    <HorizontallyFlexGapContainer style={{ gap: '20px', justifyContent: 'flex-end' }}>
                        <p style={{ color: 'white' }}>Code: <span style={{ color: 'gray' }}>{project.code}</span></p>
                        <Button variant='contained' size='small' color='info' onClick={displayProjectInfo}>Edit/View Project</Button>
                    </HorizontallyFlexGapContainer>
                </HorizontallyFlexSpaceBetweenContainer>
                }
            </VerticallyFlexGapContainer>

            <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems:'flex-start'}}>
                {/* Todos  */}
                <VerticallyFlexSpaceBetweenForm onSubmit={addIssue} style={{ possition: 'relative', backgroundColor: '#0c1427', borderRadius: '5px', border: "1px solid rgba(0,0,0,0.2)", width: '32%', minHeight:'70vh', height:'70vh'}}>
                    <HorizontallyFlexGapContainer style={{ background: "#132239", color: 'white', alignItems: 'center', gap: '10px', padding: '10px 20px', borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
                        <h3 style={{ fontWeight:'400' }}>To-Do</h3>
                        <p style={{ color: 'white', background: 'black', padding: '2px 3px', fontSize:'90%', borderRadius: '5px'}}>{numberOfTodoIssues}</p>
                    </HorizontallyFlexGapContainer>
                    <VerticallyFlexGapContainer style={{ padding: '7px', gap: '7px', minHeight: '70%', overflowY:'auto', justifyContent:'flex-start', alignItems:'flex-start' }}>
                        {numberOfTodoIssues === 0 && <p style={{ width: '100%',textAlign: 'center', color:'GrayText' }}>No tasks.<br/>Add new items here.</p>}
                        {listOfTodoIssues.map((issue, index) => {
                            return (<TodoItem key={index} type='issue' data={issue} />)
                        })}
                    </VerticallyFlexGapContainer>
                    {/* Add form  */}
                    <HorizontallyFlexGapContainer style={{ background: "#132239", borderTop: "1px solid rgba(0,0,0,.2)", position: 'sticky' }}>
                        <input id="name" name="name" value={issue.name || ''} placeholder="Add Task..." type={'text'} onChange={handleInput} style={{ width: '80%', padding: '8px 12px', border: 'none', background: "#132239", color:"white", fontSize:'100%',borderRadius: '0 0 0 5px' }} />
                        {issue.name && 
                            <>
                                {isProcessing ? 
                                    <button type="button" disabled style={{ width: '20%', padding: '8px 12px', border: 'none', background: 'gray', color: 'white', fontSize:'100%', borderRadius: '0 0 5px' }}>...</button>
                                    :
                                    <button type="submit" style={{ width: '20%', padding: '8px 12px', border: 'none', background: 'blue', color: 'white', fontSize:'100%', borderRadius: '0 0 5px' }}>Create</button>
                                }
                            </>
                        }
                    </HorizontallyFlexGapContainer>
                </VerticallyFlexSpaceBetweenForm>

                {/* In progress  */}
                <VerticallyFlexSpaceBetweenForm style={{ backgroundColor: '#0c1427', borderRadius: '5px', border: "1px solid rgba(0,0,0,0.2)", width: '32%', minHeight:'70vh', height:'70vh'}}>
                    <HorizontallyFlexGapContainer style={{ background: "#132239", color: 'white', alignItems: 'center', gap: '10px', padding: '10px 20px', borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
                        <h3 style={{ fontWeight:'400'}}>In Progress</h3>
                        <p style={{ color: 'white', background: 'black', padding: '2px 3px', fontSize:'90%', borderRadius: '5px'}}>{numberOfInProgressIssues}</p>
                    </HorizontallyFlexGapContainer>
                    <VerticallyFlexGapContainer style={{ padding: '7px', gap: '7px', minHeight: '70%', overflowY:'auto', justifyContent:'flex-start', alignItems:'flex-start' }}>
                        {numberOfInProgressIssues === 0 && <p style={{ width: '100%', textAlign: 'center', color:'GrayText' }}>No tasks.<br/>Add new items here.</p>}
                        {listOfInProgressIssues && listOfInProgressIssues.map((issue, index) => {
                            return (<TodoItem key={index} type='issue' data={issue} />)
                        })}
                    </VerticallyFlexGapContainer>
                </VerticallyFlexSpaceBetweenForm>
                
                {/* Completed  */}
                <VerticallyFlexSpaceBetweenForm style={{ backgroundColor: '#0c1427', borderRadius: '5px', border: "1px solid rgba(0,0,0,0.2)", width: '32%', minHeight:'70vh', height:'70vh'}}>
                    <HorizontallyFlexGapContainer style={{ background: "#132239", color: 'white', alignItems: 'center', gap: '10px', padding: '10px 20px', borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
                        <h3 style={{ fontWeight:'400'}}>Completed</h3>
                        <p style={{ color: 'white', background: 'black', padding: '2px 3px', fontSize:'90%', borderRadius: '5px'}}>{numberOfCompletedIssues}</p>
                    </HorizontallyFlexGapContainer>
                    <VerticallyFlexGapContainer style={{ padding: '7px', gap: '7px', minHeight: '70%', overflowY:'auto', justifyContent:'flex-start', alignItems:'flex-start' }}>
                        {numberOfCompletedIssues === 0 && <p style={{ textAlign: 'center',width: '100%', color:'GrayText' }}>No tasks.<br/>Add new items here.</p>}
                        {listOfCompletedIssues && listOfCompletedIssues.map((issue, index) => {
                            return (<TodoItem key={index} type='issue' data={issue} />)
                        })}
                    </VerticallyFlexGapContainer>
                </VerticallyFlexSpaceBetweenForm>
            </HorizontallyFlexGapContainer>
        </VerticallyFlexGapContainer>
    )
}

export default MileStones