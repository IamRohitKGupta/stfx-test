import React from 'react';
import styled from 'styled-components/macro';

const GasDiv = styled.div`
    display: flex;
    height: fit-content;
    width: fit-content;
    max-width: 480px;
    margin: auto;
`

const Gas = styled.div`
    margin-right: 0;
`

const GasIcon = styled.div`
    margin-left: 0;
`

const RouteDecode: React.FC<any> = ({ data }) => {
  const { tokenIn, tokenOut, route } = data;
  const routeLength = data.route[0].length

  return (
    <div>
        <GasDiv>
            <GasIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="IconChangeColor" height="24" width="24"><rect width="256" height="256" fill="none"></rect><path d="M56,216V56A16,16,0,0,1,72,40h80a16,16,0,0,1,16,16V216" fill="#FFBF00" stroke="#edccff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" id="mainIconPathAttribute" filter="url(#shadow)"></path><line x1="32" y1="216" x2="192" y2="216" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></line><path d="M168,112h24a16,16,0,0,1,16,16v40a16,16,0,0,0,16,16h0a16,16,0,0,0,16-16V86.6a16.1,16.1,0,0,0-4.7-11.3L216,56" fill="#FFBF00" stroke="#edccff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" id="mainIconPathAttribute"></path><line x1="136" y1="112" x2="88" y2="112" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></line><filter id="shadow"><feDropShadow id="shadowValue" stdDeviation=".5" dx="0" dy="0" floodColor="black"></feDropShadow></filter><filter id="shadow"><feDropShadow id="shadowValue" stdDeviation=".5" dx="0" dy="0" floodColor="white"></feDropShadow></filter></svg> 
            </GasIcon>
            <Gas>${Math.round(parseFloat(data.gasUseEstimateUSD) * 100)/100}</Gas>
        </GasDiv>
        <div>
            { routeLength > 0 
                ?
                    <>
                        {data.route[0][0].tokenIn.symbol} -&gt; {data.route[0][0].tokenOut.symbol}
                    </>
                :   <></>
            } 
        </div>
        <div>
            { routeLength > 1 
                ?
                    <>
                        {data.route[0][1].tokenIn.symbol} -&gt; {data.route[0][1].tokenOut.symbol}
                    </>
                :   <></>
            } 
        </div>
        <div>
            { routeLength > 2 
                ?
                    <>
                        {data.route[0][2].tokenIn.symbol} -&gt; {data.route[0][2].tokenOut.symbol}
                    </>
                :   <></>
            } 
        </div>
    </div>
  );
};

export default RouteDecode;
