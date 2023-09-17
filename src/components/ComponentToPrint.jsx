/* eslint-disable react/display-name */
import React from 'react'
import { ReportHeader, TopBar, TableList, ReportBody, ReportFooter, InstitutionDetails, ReportPaperContainer, GeneralProjectOverview } from './styles/ReportStyledComponents';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    // FORM PROCESSING AND RESPONSE PROVISION
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const { selectedProject } = useSelector(state => state.project);
    const { listOfProjectIssues } = useSelector(state => state.issue);
    const { listOfProjectResources } = useSelector(state => state.material);

    return (
        <ReportPaperContainer ref={ref}>
            <TopBar>
                <img src='/soundssProLogo.png' alt='' />
                <InstitutionDetails>
                    <p>Email: {user.email}</p>
                    <p>{selectedProject.country}, {selectedProject.province}</p>
                    {selectedProject.district && <p>{selectedProject.district} District</p>}
                    {selectedProject.sector && <p>{selectedProject.sector} Sector</p>}
                    {selectedProject.address && <p>Street address: {selectedProject.address}</p>}
                </InstitutionDetails>
            </TopBar>
            <ReportHeader>
                <h2>{selectedProject.name}</h2>
                <h3>General Project Progress Report</h3>
                
                <div className='report-period'>
                    <div className='left'>
                        <p>Project code: {selectedProject.code}</p>
                    </div>
                    <div className='right'>
                        <p>Generated on: {new Date().toDateString()}</p>
                        <p>{`By: ${user.fullName}`}</p>
                    </div>
                </div>
            </ReportHeader>

            <ReportBody style={{ gap: '20px' }}>
                <strong>General project overview</strong>

                <GeneralProjectOverview>
                    <p>Created on: {new Date(selectedProject.creationDate).toDateString()}</p>
                    <p>Progress: {Math.round(selectedProject.progress * 10) / 10} %</p>
                </GeneralProjectOverview>

                <p>This report is a summary of the progress of {selectedProject.name} major millestones, and resources for the project completion.</p>
                
                <strong>Major Millestones (Phases)</strong>

                <TableList>
                    <thead>
                        <tr>
                            <th>Millestone</th>
                            <th>Created on</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOfProjectIssues && listOfProjectIssues.map((issue, index) => {
                            return (
                                <tr key={index}>
                                    <td>{issue.name}</td>
                                    <td>{new Date(issue.creationDate).toDateString()}</td>
                                    <td>{issue.progress}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </TableList>

                {user.role === 'Producer' && 
                    <>
                        <strong>Resource/Material usage</strong>
                        <TableList>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {/* <th>Entry date</th> */}
                                    <th>Quantity</th>
                                    <th>Unit price</th>
                                    {/* <th>Used</th>
                                    <th>Remaining</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {listOfProjectResources && listOfProjectResources.map((resource, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{resource.name}</td>
                                            {/* <td>{new Date(resource.entryDate).toDateString()}</td> */}
                                            <td>{resource.quantity}</td>
                                            <td>{resource.unitPrice}</td>
                                            {/* <td>{resource.used}</td>
                                            <td>{resource.quantity - resource.used}</td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </TableList>
                    </>
                }
            </ReportBody>

            <ReportFooter>
                <p>Copyright {new Date().getFullYear()} &copy; Soundss Pro. All Rights Reserved. </p>
            </ReportFooter>
        </ReportPaperContainer>
    )
})