import React from 'react';
import { RingLoader } from 'react-spinners';
import styled from 'styled-components/macro';

interface LoaderProps {
  loading: boolean;
}

const LoadingContainer = styled.div`
    display: flex;
    margin: auto;
    width: fit-content;
    height: fit-content;
    padding: 1rem;
`

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <LoadingContainer className='sweet-loading'>
      <RingLoader color={'#ffbf00'} loading={loading} />
    </LoadingContainer>
  );
};

export default Loader;
