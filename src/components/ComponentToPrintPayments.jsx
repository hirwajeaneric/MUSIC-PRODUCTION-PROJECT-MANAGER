/* eslint-disable react/display-name */
import React, { useEffect } from 'react'
import { ReportHeader, TopBar, TableList, ReportBody, ReportFooter, InstitutionDetails, ReportPaperContainer } from './styles/ReportStyledComponents';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayments } from '../redux/features/paymentSlice';

export const ComponentToPrintPayments = React.forwardRef((props, ref) => {
    // FORM PROCESSING AND RESPONSE PROVISION
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getAllPayments({ user: user }));
    },[dispatch, user])

    const { listOfAllPayments } = useSelector(state => state.payment);

    return (
        <ReportPaperContainer ref={ref}>
            <TopBar>
                <img src='/soundssProLogo.png' alt='' />
                <InstitutionDetails>
                    <p>Email: {user.email}</p>
                </InstitutionDetails>
            </TopBar>
            <ReportHeader>
                <h2>Income Report</h2>
                
                <div className='report-period'>
                    <div className='right' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <p>Generated on: {new Date().toDateString()}</p>
                        <p>{`By: ${user.fullName}`}</p>
                    </div>
                </div>
            </ReportHeader>

            <ReportBody style={{ gap: '20px' }}>
                <strong>List of payments</strong>
                <p>This is an income report for all payments we have recieved.</p>
                <TableList>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Payer</th>
                            <th>Entry date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOfAllPayments && listOfAllPayments.map((payment, index) => {
                            return (
                                <tr key={index}>
                                    <td>{payment.description}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.user}</td>
                                    <td>{new Date(payment.entryDate).toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </TableList>

                
            </ReportBody>

            <ReportFooter>
                <p>Copyright {new Date().getFullYear()} &copy; Soundss Pro. All Rights Reserved. </p>
            </ReportFooter>
        </ReportPaperContainer>
    )
})