/* eslint-disable react/display-name */
import React from 'react'
import { ReportHeader, TopBar, ReportBody, ReportFooter, InstitutionDetails, ReportPaperContainer } from './styles/ReportStyledComponents';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

const style1={ 
    display:'flex', 
    width: '100%', 
    textAlign:'center',
    gap: '10px'
}

export const ComponentToPrintContract = React.forwardRef((props, ref) => {
    // FORM PROCESSING AND RESPONSE PROVISION
    const [ cookies ] = useCookies(null);
    const user = cookies.UserData;

    const { selectedProject, listOfUsersInAProject, managerOfSelectedProject } = useSelector(state => state.project);
    const { listOfProjectIssues } = useSelector(state => state.issue);

    return (
        <ReportPaperContainer ref={ref}>
            <TopBar>
                <div className='logo_and_studio'>
                    <img src='/soundssProLogo.png' alt='' />
                    <h1>{selectedProject.studio}</h1>
                </div>
                <InstitutionDetails>
                    <p>Email: {user.email}</p>
                    <p>{selectedProject.country}, {selectedProject.province}</p>
                    {selectedProject.district && <p>{selectedProject.district} District</p>}
                    {selectedProject.sector && <p>{selectedProject.sector} Sector</p>}
                    {selectedProject.address && <p>Street address: {selectedProject.address}</p>}
                </InstitutionDetails>
            </TopBar>
            <ReportHeader>
                {/* <h2>{selectedProject.name}</h2> */}
                <h2 style={{ width: '100%', textAlign: 'center' }}>Contract on Project Agreements</h2>
                
                <div className='report-period'>
                    <div className='left'>
                        <p>Project code: {selectedProject.code}</p>
                    </div>
                    <div className='right' style={{ gap: '5px' }}>
                        <p>Generated on: {new Date().toDateString()}</p>
                        <p>{`By: ${user.fullName}`}</p>
                    </div>
                </div>
            </ReportHeader>

            <ReportBody style={{ gap: '10px' }}>
                <p style={{ lineHeight:'25px' }}>This contract summarizes the agreement for creating a song named: <em>"{selectedProject.name}"</em>.
                    <br/>
                    The contract joins the studio producer: <em>"{selectedProject.producerName}"</em> and artist(s): 
                    {listOfUsersInAProject.map((artist, index) => {
                        return (
                            <em key={index}> {artist.fullName}, </em>
                        )
                    })}
                    <br/>
                    The cost of the entire project is <em>{selectedProject.price} {selectedProject.currency}</em>.
                    <br/>
                    Payment strategy: <em>{selectedProject.paymentStrategy}</em>.
                </p>
                <br/>
                <span style={style1}><p>Description:</p> <em style={{ textAlign: 'left'}}>{selectedProject.description}</em></span>
                <span style={style1}><p>Type:</p> <em>{selectedProject.projectType}</em></span>
                <span style={style1}><p>Code:</p> <em>{selectedProject.code}</em></span>
                <span style={style1}><p>Creation Date:</p> <em>{new Date(selectedProject.creationDate).toDateString()}</em></span>
                <span style={style1}><p>Estimated end date:</p> <em>{new Date(selectedProject.estimatedEndDate).toDateString()}</em></span>
                <span style={style1}>
                    <p>Phases:</p> <em>{listOfProjectIssues.length}</em>
                    ({listOfProjectIssues.map((phase, index) => {
                        return (
                            <em key={index}>{phase.name},</em>
                        )
                    })})
                </span>
                <span style={style1}>
                    <p>Country: </p> 
                    <em>{selectedProject.country}</em>
                    {selectedProject.province &&
                        <> 
                            ,
                            <p> province:</p> 
                            <em>{selectedProject.province}</em>
                        </>
                    }
                </span>
                {selectedProject.city && <span style={style1}><p>City:</p> <em>{selectedProject.city}</em></span>}
                <span style={style1}>
                    {selectedProject.district &&
                        <> 
                            <p>District: </p> 
                            <em>{selectedProject.district}</em>
                        </>
                    } 
                    {selectedProject.sector &&
                        <> ,
                            <p>Sector:</p> 
                            <em>{selectedProject.sector}</em>
                        </>
                    }
                </span>
                <span style={style1}><p>Address:</p> <em>{selectedProject.address}</em></span>
                <span style={style1}><p>Name of Studio:</p> <em>{selectedProject.studio}</em></span>
                
                <br/><br/>
                {selectedProject.managerApproval === 'Approved' && <p style={{ lineHeight:'25px' }}>I, {managerOfSelectedProject.fullName}, in the name of my client(s) do agree on terms and conditions described in this document and thereby commit myself and my client to the successful completion of this contract agreements done with studio.</p>}
                    
                <div style={{ width: '100%', marginTop: '20px',display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems:'flex-start' }}>
                    <div style={{ width:'50%' }}>
                        <p style={{ lineHeight:'25px' }}>{managerOfSelectedProject.fullName}<br/>
                        {managerOfSelectedProject.role}<br/>
                        <strong>{selectedProject.managerApproval && "Signed"}</strong>
                        </p>
                    </div>
                    <div style={{ width:'50%' }}>
                        <p style={{ lineHeight:'25px' }}>{selectedProject.producerName}<br/>
                        Producer<br/>
                        <strong>Signed</strong>
                        </p>
                    </div>
                </div>
            </ReportBody>

            <ReportFooter>
                <p>Copyright {new Date().getFullYear()} &copy; Soundss Pro. All Rights Reserved. </p>
            </ReportFooter>
        </ReportPaperContainer>
    )
})