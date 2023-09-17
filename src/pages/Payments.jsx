import { HeaderOne, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import { Helmet } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllPayments } from "../redux/features/paymentSlice";
import PaymentsTable from "../components/tables/PaymentsTable";
import { useNavigate } from "react-router-dom";
import { Download } from "@mui/icons-material";


const Payments = () => {
  const [ cookies ] = useCookies(null);
  const user = cookies.UserData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPayments({ user: user }));
  },[dispatch, user])

  const { isLoading, listOfAllPayments } = useSelector(state => state.payment);

  return (
    <VerticallyFlexGapContainer style={{ gap: '15px' }}>
      <Helmet>
        <title>Payments</title> 
      </Helmet>

      {/* First dashboard section  */}
      <VerticallyFlexGapContainer style={{ gap: '20px', backgroundColor: '#02457a', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}> 
          <HeaderOne style={{ color: '#d6e8ee', width: '100%', textAlign: 'left' }}>Payments</HeaderOne>
          <button 
            style={{ display: 'flex', background: 'black', border: 'none', borderRadius: '5px', color: 'white', padding: '8px 12px', cursor: 'pointer' }}
            onClick={() => { 
              navigate(`/payment-report`);
            }}>
              <Download style={{ fontSize: '120%' }}/> Print
          </button>
        </div>
        {isLoading ? 
          <p style={{ color: 'white' }}>Loading...</p> 
          : 
          <>
            <PaymentsTable data={listOfAllPayments} />
          </>
        }
      </VerticallyFlexGapContainer>  
    </VerticallyFlexGapContainer>
  )
}

export default Payments