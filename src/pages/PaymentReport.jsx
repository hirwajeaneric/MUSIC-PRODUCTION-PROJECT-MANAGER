import { Button } from "@mui/material";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { HeaderTwo, HorizontallyFlexSpaceBetweenContainer, VerticallyFlexGapContainer } from "../components/styles/GenericStyles"
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrintPayments } from "../components/ComponentToPrintPayments";

export default function PaymentReport() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => componentRef.current
  });

  return (
    <VerticallyFlexGapContainer style={{ gap: '20px'}}>
      <Helmet>
        <title>{`Income report`}</title>
        <meta name="description" content={`Report for all recieved payments.`} /> 
      </Helmet>
      <HorizontallyFlexSpaceBetweenContainer>
        <HeaderTwo style={{ width: '100%', textAlign: 'left', color: 'white' }}><strong>Income Report </strong></HeaderTwo>
        <Button variant='contained' size='small' color='secondary' onClick={handlePrint}>Print</Button>
      </HorizontallyFlexSpaceBetweenContainer>

      <VerticallyFlexGapContainer style={{ gap: '20px', alignItems: 'flex-start' }}>
        <ComponentToPrintPayments ref={componentRef} />      
      </VerticallyFlexGapContainer>
    </VerticallyFlexGapContainer>
  )
}