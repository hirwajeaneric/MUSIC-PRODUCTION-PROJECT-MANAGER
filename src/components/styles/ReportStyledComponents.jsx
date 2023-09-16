import styled from 'styled-components';

export const ReportPaperContainer = styled.div`
    width: 210mm;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 60px;
`;

export const TopBar = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    img {
        width: 35%;
    }

    h1 {
        font-size: 150%;
    }

    h2 {
        font-size: 120%;
    }
`;

export const ReportHeader = styled.div`
    width: 100%;
    padding: 20px 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    border-bottom: 1px solid gray;

    img {
        width: 15%;
    }

    div.report-period {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 85%;

        div.left {
            display: flex;
            flex-direction: column;
            justify-content: fle-start;
            align-items: flex-start;
            gap: 20px;
    
            h2 {
                font-size: 140%;
            } 
        
            h3 {
                font-size: 120%;
            }   
        }
    
        div.right {
            display: flex;
            flex-direction: column;
            justify-content: fle-start;
            align-items: flex-start;
            gap: 20px;
    
    
        }
    }
`;

export const ReportFooter = styled.div`
    width: 100%;
    // padding: 50px;
    margin-top: 30px;
    font-size: 85%;
    text-align: left;
`;

export const ReportBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 90%;
    margin: 20px 0;

    h1 {
        margin-bottom: 10px;
        width: 100%;
        padding-top: 20px;
        border-top: 1px solid gray;
    }

`;

export const GeneralProjectOverview = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
`;

export const InstitutionDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;

    p {
        font-size: 85%;
    }

`;

export const ReportDateAndGenerator = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 85%;
    padding-bottom: 20px;
    border-bottom: 1px solid gray;
`;

export const ReportContent = styled.div`
    font-size: 90%;
    padding-top: 20px;

    h4 {
        margin: 20px 0 10px;
    }
`;

export const Table = styled.table`
    width: 100%;

    thead {
        tr {
            th {
                text-align: left;
            }
        }
    }
`;

export const TableList = styled.table`
    border-collapse: collapse;
    width: 100%;

    thead {
        tr {
            th {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid gray;
            }
        }
    }

    tbody {
        tr {
            td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid gray;
            }
        }
    }


`;