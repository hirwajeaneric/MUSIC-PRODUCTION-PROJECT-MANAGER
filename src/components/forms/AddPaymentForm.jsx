/* eslint-disable react/prop-types */
import { useContext, useState } from 'react'
import { FormElement, HeaderTwo, HorizontallyFlexGapContainer, VerticallyFlexGapContainer, VerticallyFlexGapForm } from '../styles/GenericStyles'
import axios from 'axios'
import { GeneralContext } from '../../App';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import { currencies } from '../../utils/Currencies';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const AddPaymentForm = (props) => {
    const { project } = props;

    const [ image, setImage ] = useState({});
    const { setOpen, setResponseMessage } = useContext(GeneralContext);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const handleImage = ({ currentTarget : target }) => {
        setImage(target.files[0]);
    }

    const sendEmail = (email) => {
        axios.post(`${serverUrl}/api/v1/mppms/email/`, email)
    }

    // Manager approval
    const onSubmit = data => {
        setIsProcessing(true);

        const formData = {};
        formData.description = data.description;
        formData.attachment = image;
        formData.amount = data.amount;
        formData.currency = data.currency;
        formData.project = project._id;
        formData.user = user.fullName;

        var config = {
            headers: { "Content-Type" : "multipart/form-data" }
        };

        axios.post(`${serverUrl}/api/v1/mppms/payment/add`, formData, config)
        .then(response => {
            console.log(response.status);
            if (response.status === 201) {
            sendEmail({
                email: project.producerEmail, 
                subject: `New payment submitted`, 
                text: `Dear ${project.producerName}, \n A new payment was submitted by ${user.fullName} for project: ${project.name}. \n\nPaid amount: ${response.data.amount} ${response.data.currency}\n\nClick on the link bellow to view more about the project: \nhttp://localhost:5000/${project.code} \n\nBest regards,`
            });
            
            setIsProcessing(false);
            setResponseMessage({ message: response.data.message, severity: 'success' });
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
                <HeaderTwo style={{ width: '100%', textAlign: 'left' }}>Upload payment</HeaderTwo>
                <HorizontallyFlexGapContainer style={{ gap: '20px', alignItems: 'flex-start' }}>
                    <FormElement style={{ color: 'white' }}>
                        <label htmlFor="description">Description</label>
                        <textarea 
                            type="text" 
                            id="description"
                            placeholder="Description" 
                            {...register("description", 
                            {required: true})} 
                            aria-invalid={errors.description ? "true" : "false"}>
                        </textarea>
                        {errors.description?.type === "required" && (
                            <p role="alert">A description must be provided</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="amount">Quantity *</label>
                        <input 
                            type="number" 
                            id="amount"
                            placeholder="Amount" 
                            {...register("amount", 
                            {required: true})} 
                            aria-invalid={errors.amount ? "true" : "false"}
                        />
                        {errors.amount?.type === "required" && (
                            <p role="alert">The paid amount must be provided</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: '#97cadb' }}>
                        <label htmlFor="currency">Currency *</label>
                        <select 
                            {...register("currency", { required: true })}
                            aria-invalid={errors.currency ? "true" : "false"}
                        >
                            <option value="">Choose currency</option>
                            {currencies.map((currency, index) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>
                        {errors.currency?.type === "required" && (
                        <p role="alert">Choose currency</p>
                        )}
                    </FormElement>
                    <FormElement style={{ color: 'gray' }}>
                        <label htmlFor="image">Image</label>
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            onChange={handleImage}
                        />
                    </FormElement>
                    <FormElement style={{ width: '20%' }}>
                        {isProcessing 
                        ? <Button disabled variant="contained" color="primary" size="small">PROCESSING...</Button> 
                        : <Button variant="contained" color="success" size="small" type="submit">Upload</Button>
                        }
                    </FormElement>
                </HorizontallyFlexGapContainer>  
            </VerticallyFlexGapForm>
        </VerticallyFlexGapContainer>
    )
}

export default AddPaymentForm