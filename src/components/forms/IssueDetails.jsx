/* eslint-disable react/prop-types */
import { FormElement, HorizontallyFlexGapContainer, HorizontallyFlexGapForm, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../styles/GenericStyles'
import { useContext, useState } from "react";
import { GeneralContext } from "../../App";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getProjectIssues } from '../../redux/features/issueSlice';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { Label } from '@mui/icons-material';
import StatusButtonGroup from '../StatusButtonGroup';
import { MdDelete, MdNotes, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { BiCalendar } from 'react-icons/bi';
import { LuSend } from 'react-icons/lu';
import { getIssueComments } from '../../redux/features/commentSlice';
import CommentComponent from '../CommentComponent';
import { useCookies } from 'react-cookie';
import TodoItem from '../TodoItem';
import { getIssueSprints } from '../../redux/features/sprintSlice';

const IssueDetails = (props) => {
  const { data } = props;
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;
  const [issue, setIssue] = useState({});
  const [project, setProject] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingSprint, setIsProcessingSprint] = useState(false);
  const [isProcessingComment, setIsProcessingComment] = useState(false);
  const { setOpen, setResponseMessage, handleOpenModal } = useContext(GeneralContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});
  const [sprint, setSprint] = useState({});

  // Handle activity/sprint input changes
  const handleActivityInput = ({ currentTarget: input }) => {
    setSprint({ ...sprint, [input.name]: input.value });
  }

  // Handle input changes
  const handleChange = ({ currentTarget: input }) => {
    setIssue({ ...issue, [input.name]: input.value });
  }

  // Handle comment changes
  const handleComment = ({ currentTarget: input }) => {
    setComment({...comment, [input.name]: input.value });
  }


  // FETCHING INFORMATION ON COMPONENT LOADING
  useEffect(() => {
    // Set up a loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Fetch issue details 
    axios.get(serverUrl+'/api/v1/mppms/issue/findById?id='+data.id)
    .then(response => {
      response.data.issue.creationDate = new Date(response.data.issue.creationDate).toUTCString();
      setIssue(response.data.issue);

      // Fetch issue related comments 
      dispatch(getIssueComments(response.data.issue._id));

      // Fetch sprints for an issue
      dispatch(getIssueSprints(response.data.issue._id));

      // Fetch project
      axios.get(serverUrl+'/api/v1/mppms/project/findById?id='+response.data.issue.project)
      .then(response => {
        setProject(response.data.project)
      })
      .catch(error => console.error(error));

    })
    .catch(error => console.error(error));
  },[data.id, dispatch]);





  // Update issue 
  const updateIssue = (e) => {
    e.preventDefault();

    setIsProcessing(true); 
    axios.put(serverUrl+'/api/v1/mppms/issue/update?id='+issue._id, issue)
    .then(response => {
      if (response.status === 200) {
        dispatch(getProjectIssues(issue.project));
        setTimeout(() => {
          setIsProcessing(false);
          setResponseMessage({ message: response.data.message, severity: 'success' });
          setOpen(true);
          handleOpenModal();
        }, 2000);
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




  // Add sprint to issue 
  const addSprint = (e) => {
    e.preventDefault();
  
    setIsProcessingSprint(true); 
    sprint.issue = issue._id;
    sprint.project = issue.project;
    
    axios.post(serverUrl+'/api/v1/mppms/sprint/add', sprint)
    .then(response => {
      if (response.status === 201) {
        dispatch(getIssueSprints(issue._id));
        setIsProcessingSprint(false);
        setSprint({});
      }
    })
    .catch(error => {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setIsProcessingSprint(false);
      }
    })
  }




  // Add comment 
  const addComment = (e) => {
    e.preventDefault();

    if (comment.message === '') {
      setResponseMessage({ message: 'Provide a message', severity:'warning'})
      setOpen(true);
      return;
    } else {
      comment.senderName = user.fullName;
      comment.senderId = user.id;
      comment.issue = issue._id;

      setIsProcessingComment(true); 
      
      axios.post(serverUrl+'/api/v1/mppms/comment/add', comment)
      .then(response => {
        if (response.status === 201) {
          dispatch(getIssueComments(response.data.comment.issue));
          setIsProcessingComment(false);
          setComment({});
        }
      })
      .catch(error => {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setIsProcessingComment(false);
        }
      })
    }
  };
  


  // Delete issue
  const deleteIssue = (e) => {
    e.preventDefault();
    axios.delete(serverUrl+'/api/v1/mppms/comment/deleteByIssue?issue='+issue._id)
    .then(response => {
      if (response.status === 200) {
        axios.delete(serverUrl+'/api/v1/mppms/issue/delete?id='+issue._id)
        .then(response => {
          if (response.status === 200) {
            dispatch(getProjectIssues(issue.project));
            handleOpenModal();
          }
        })
        .catch(error => {
          if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            setResponseMessage({ message: error.response.data.msg, severity:'error'})
            setOpen(true);
          }
        })
      }
    })
    .catch(error => {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setResponseMessage({ message: error.response.data.msg, severity:'error'})
        setOpen(true);
      }
    })
  }


  // Calling store data
  const { isLoading, listOfIssueComments } = useSelector(state => state.comment);
  const { isLoading: loadingIssueSprints, listOfIssueSprints, numberOfIssueSprints } = useSelector(state => state.sprint);



  if (loading) {
    return (
      <p style={{ color: 'white'}}>Loading...</p>
    );
  }

  
  
  return (
    <VerticallyFlexGapContainer style={{ gap: '10px', position: 'relative', color: 'white' }}>
      
      <HorizontallyFlexSpaceBetweenContainer style={{ borderBottom: '1px solid #94b8b8', paddingBottom: '10px' }}>
        <p><strong>{project.name}</strong> / Phases</p>
      </HorizontallyFlexSpaceBetweenContainer>
      
      <HorizontallyFlexSpaceBetweenContainer style={{ flexWrap:'wrap', borderBottom: '1px solid #94b8b8', paddingBottom: '10px' }}>
        <h2>{issue.name}</h2>
        {user.role === 'Producer' && <Button variant='contained' size='small' color='error' onClick={deleteIssue}>Delete &nbsp;<MdDelete /></Button>}
      </HorizontallyFlexSpaceBetweenContainer>
      
      <VerticallyFlexGapContainer style={{ gap: '20px', color: '#97cadb', fontSize:'90%', position: 'relative' }}>
        <HorizontallyFlexGapContainer style={{ gap: '20px' }}>
          <Label style={{ color: '#018abe' }}/> 
          {user.role === 'Producer' && <StatusButtonGroup type='issue' data={issue} />}
          {user.role !== 'Producer' && <h3 style={{ color: 'white' }}>Progress status: {issue.progress}</h3>}
        </HorizontallyFlexGapContainer>


        <VerticallyFlexGapContainer>
          <VerticallyFlexGapForm onSubmit={updateIssue} style={{ overflowY: 'auto' }}>
            <FormElement style={{ gap: '0px' }}>
              <div className="input-with-icon">
                <MdOutlineDriveFileRenameOutline />
                <div>
                  {user.role !== 'Producer' ? 
                    <p style={{ color: 'white', padding: '10px 0' }}>{issue.name}</p>
                    :
                    <input type={'text'} placeholder='Name' value={issue.name} name='name' onChange={handleChange} />
                  }
                </div>
              </div>
            </FormElement>
            <FormElement style={{ gap: '0px' }}>
              <div className="input-with-icon">
                <MdNotes />
                <div>
                  {user.role !== 'Producer' ? 
                    <p style={{ color: 'white', padding: '10px 0' }}>{issue.description}</p>
                    :
                    <input type={'text'} placeholder='Notes' value={issue.description} name='description' onChange={handleChange} />
                  }
                </div>
              </div>
            </FormElement>
            <FormElement style={{ gap: '0px' }}>
              <div className="input-with-icon">
                <BiCalendar/>
                <div>
                  {user.role !== 'Producer' ?
                    <p style={{ color: 'white', padding: '10px 0' }}>{issue.startDate && new Date(issue.startDate).toLocaleString()}</p>
                    :
                    <>
                      <label htmlFor="startDate">Start Date {issue.startDate && <span style={{ color: 'white' }}>{new Date(issue.startDate).toLocaleString()}</span>}</label>
                      <input type={'date'} id='startDate' value={issue.startDate} name='startDate' onChange={handleChange} />
                    </>
                  }
                </div>
              </div>
            </FormElement>
            <FormElement style={{ gap: '0px' }}>
              <div className="input-with-icon">
                <BiCalendar/>
                <div>
                  {user.role !== 'Producer' ?
                    <p style={{ color: 'white', padding: '10px 0' }}>{issue.endDate && new Date(issue.endDate).toLocaleString()}</p>
                    :
                    <>
                      <label htmlFor="endDate">End Date {issue.endDate && <span style={{ color: 'white' }}>{new Date(issue.endDate).toLocaleString()}</span>}</label>
                      <input type={'date'} id='endDate' value={issue.endDate} name='endDate' onChange={handleChange} />
                    </>
                  }
                </div>
              </div>
            </FormElement>
            {user.role === 'Producer' && <HorizontallyFlexGapContainer style={{ marginTop: '20px' }}>
              {isProcessing 
                ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
                : <Button variant="contained" color="primary" size="small" type="submit">Save changes</Button>
              }
            </HorizontallyFlexGapContainer>}
          </VerticallyFlexGapForm>




          {/* Activities / Sprints ****************************************************************************************************************************/}
          <VerticallyFlexGapForm onSubmit={addSprint} style={{ marginTop: '20px', background: '#018abe', padding: '20px', borderRadius: '5px', gap: '10px' }}>
            <h3 style={{ width: '100%', textAlign: 'left', color: 'black' }}>{user.role === 'Producer' ? "Add activities" : "Activities"}</h3>

            <HorizontallyFlexGapContainer style={{ borderTop: "1px solid rgba(0,0,0,.2)" }}>
                {user.role === 'Producer' && <input id="name" name="name" value={sprint.name || ''} placeholder="Add activity..." type={'text'} onChange={handleActivityInput} style={{ width: '80%', padding: '8px 12px', border: 'none', color:"black", background: 'transparent', fontSize:'100%',borderRadius: '0 0 0 5px' }} />}
                {sprint.name && 
                    <>
                        {isProcessingSprint ? 
                            <button type="button" disabled style={{ width: '20%', padding: '8px 12px', border: 'none', background: '#97cadb', color: 'white', fontSize:'100%', borderRadius: '0 0 5px' }}>...</button>
                            :
                            <button type="submit" style={{ width: '20%', cursor: 'pointer', padding: '8px 12px', border: 'none', background: 'green', color: 'white', fontSize:'100%', borderRadius: '0 0 5px' }}>Add</button>
                        }
                    </>
                }
            </HorizontallyFlexGapContainer>
            <VerticallyFlexGapContainer style={{ gap: '10px'}}>
                {
                  loadingIssueSprints 
                  ?
                    <p>Loading...</p>
                  :
                  <>
                    {numberOfIssueSprints > 0 && <></>}
                    {listOfIssueSprints.map((sprint, index) => {
                      return (
                        <TodoItem key={index} type='sprint' data={sprint} />
                      )
                    })}
                  </>
                }
            </VerticallyFlexGapContainer>
          </VerticallyFlexGapForm>




          {/* COMMENTS  *************************************************************************************************************************** */}
          {/* List of comment */}
          <VerticallyFlexGapContainer style={{ padding: '20px 0' }}>
            <h4 style={{ padding: '5px', color: 'white', background:'#02457a', borderRadius:'5px' }}>Comments</h4>
            <VerticallyFlexGapContainer style={{ gap: '10px', padding: '20px 0' }}>
              {isLoading 
              ?
              <p>Loading...</p>
              : 
              <>
                {listOfIssueComments.length !== 0 && listOfIssueComments.map((comment,index) => {
                  return (
                    <CommentComponent data={comment} user={user} key={index}/>
                  )
                })}
                {listOfIssueComments.length === 0 && <p>No comments yet</p>}
              </>}
            </VerticallyFlexGapContainer>
          </VerticallyFlexGapContainer>

          {/* Comment form  */}
          <HorizontallyFlexGapForm onSubmit={addComment} style={{ background:'#02457a', padding:'10px', position: 'sticky', bottom: '0px', left: '0%', right: '0%', borderTop: '1px solid #97cadb', borderBottom: '1px solid #97cadb', }}>
            <FormElement>
              <input style={{ border: 'none', padding: '5px', background: '#02457a', color: 'white' }} name='message' value={comment.message || ''} placeholder='Add comment...' onChange={handleComment} />
            </FormElement>
            {isProcessingComment 
              ? <Button disabled variant="contained" color="primary" size="medium">...</Button> 
              : <Button variant="text" color="primary" size="medium" type="submit"><LuSend style={{ fontSize: '150%' }}/></Button>
            }
          </HorizontallyFlexGapForm>
        </VerticallyFlexGapContainer>

      </VerticallyFlexGapContainer>
    </VerticallyFlexGapContainer>
  )
}

export default IssueDetails