import { Button } from "@mui/material";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { HeaderTwo, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import { getSelectedProject } from "../redux/features/projectSlice";
import { ComponentToPrint } from "../components/ComponentToPrint";
import { useReactToPrint } from 'react-to-print';
import { getProjectIssues } from "../redux/features/issueSlice";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import axios from "axios";
import { getProjectResources } from "../redux/features/materialSlice";

export default function Reports() {
  const dispatch = useDispatch();
  const params = useParams();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => componentRef.current
  });

  // Fetching project 
  useEffect(() => {
    // Get project info
    dispatch(getSelectedProject({ projectCode: params.code }));
    
    axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${params.code}`)
    .then(response => {
      // Get project issues
      dispatch(getProjectIssues(response.data.project._id));

      // Get project materials
      dispatch(getProjectResources(response.data.project._id))
    })
    .catch(error => console.error(error))

  },[dispatch, params.code]);  

  const { selectedProject } = useSelector(state => state.project);

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`Report preview - ${selectedProject.name}`}</title>
        <meta name="description" content={`Report preview for project ${selectedProject.name}.`} /> 
      </Helmet>
      <HorizontallyFlexSpaceBetweenContainer>
        <HeaderTwo style={{ width: '100%', textAlign: 'left', color: 'white' }}><strong>Report preview </strong></HeaderTwo>
        <Button variant='contained' size='small' color='secondary' onClick={handlePrint}>Print</Button>
      </HorizontallyFlexSpaceBetweenContainer>

      <VerticallyFlexGapContainer style={{ gap: '20px', alignItems: 'flex-start' }}>
        <ComponentToPrint ref={componentRef} />      
      </VerticallyFlexGapContainer>
    </VerticallyFlexGapContainer>
  )
}