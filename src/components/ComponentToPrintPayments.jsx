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

    const { listOfAllPayments, totalAmountOfAllPayments } = useSelector(state => state.payment);

    return (
        <ReportPaperContainer ref={ref}>
            <TopBar>
                <img src='/soundssProLogo.png' alt='' />
                <InstitutionDetails>
                    <p>Email: {user.email}</p>
                </InstitutionDetails>
            </TopBar>
            <ReportHeader>
                <h1>Income Report</h1>
                
                <div className='report-period'>
                    <div className='right' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <p>Generated on: {new Date().toDateString()}</p>
                        <p>{`By: ${user.fullName}`}</p>
                    </div>
                </div>
            </ReportHeader>

            <ReportBody style={{ gap: '20px' }}>
                <h2>List of payments</h2>
                <p><strong>Period: </strong>Sun Sep 17 2023 - Mon Sep 18 2023 </p>
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
                        <tr>
                            <td>Total</td>
                            <td>{totalAmountOfAllPayments}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </TableList>

                
            </ReportBody>

            <ReportFooter>
                <p>Copyright {new Date().getFullYear()} &copy; Soundss Pro. All Rights Reserved. </p>
            </ReportFooter>
        </ReportPaperContainer>
    )
})