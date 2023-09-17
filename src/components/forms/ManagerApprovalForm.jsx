/* eslint-disable react/prop-types */
import { useContext, useState } from 'react'
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../styles/GenericStyles'
import axios from 'axios'
import { GeneralContext } from '../../App';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useCookies } from 'react-cookie';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const ManagerApprovalForm = (props) => {
    const { project } = props;

    const { setOpen, setResponseMessage } = useContext(GeneralContext);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const sendEmail = (email) => {
        axios.post(`${serverUrl}/api/v1/mppms/email/`, email)
    }

    // Manager approval
    const onSubmit = data => {
        setIsProcessing(true);

        const formData = {};
        formData.managerApproval = data.managerApproval;
        formData.managerApprovalDate = new Date().toISOString();
        formData.managerComment = data.managerComment;

        axios.put(`${serverUrl}/api/v1/mppms/project/update?id=${project._id}`, formData)
        .then(response => {
            if (response.status === 200) {
            sendEmail({
                email: project.producerEmail, 
                subject: `Project ${formData.managerApproval}`, 
                text: `Dear ${project.producerName}, \n ${user.fullName} has updated the project approval status. \n\nClick on the link bellow to view more about the project: \nhttp://localhost:5000/${project.code} \n\nBest regards,`
            });
            
            setIsProcessing(false);
            setResponseMessage({ message: 'Project updated', severity: 'success' });
            setOpen(true);
            setTimeout(() => { window.location.reload() }, 2000);
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
    
    return (
        <VerticallyFlexGapContainer>
            <VerticallyFlexGapForm onSubmit={handleSubmit(onSubmit)} style={{ gap: '20px', background: '#02457a', color: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>{project.managerApproval ? "Update contract approval" : "Approve contract"}</HeaderTwo>
                <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'center' }}>
                <FormElement style={{ color: 'white' }}>
                    <label htmlFor="managerApproval">Approval</label>
                    <select 
                    {...register("managerApproval", { required: true })}
                    aria-invalid={errors.managerApproval ? "true" : "false"}
                    >
                        <option value="">Select approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="In discussions">In discussions</option>
                    </select>
                    {errors.managerApproval?.type === "required" && (
                    <p role="alert">Approval is required</p>
                    )}
                </FormElement>
                <FormElement style={{ color: 'white' }}>
                    <label htmlFor="managerComment">Comment</label>
                    <input 
                        type="text" 
                        id="managerComment"
                        placeholder="Comment" 
                        {...register("managerComment", {required: false})} 
                    />
                </FormElement>
                <FormElement style={{ width: '20%' }}>
                    {isProcessing 
                    ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
                    : <Button variant="contained" color="primary" size="small" type="submit">Approve</Button>
                    }
                </FormElement>
                </HorizontallyFlexGapContainer>  
            </VerticallyFlexGapForm>
        </VerticallyFlexGapContainer>
    )
}

export default ManagerApprovalForm