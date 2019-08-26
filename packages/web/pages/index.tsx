import React from 'react';
import styled from 'styled-components';

import { LoginScreen } from 'src/components/LoginScreen/LoginScreen';
import { AuthProvider } from 'src/context/AuthContext';

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

const IndexPage = () => (
  <AuthProvider>
    <LoginScreen>
      <Title>My page</Title>
    </LoginScreen>
  </AuthProvider>
);

export default IndexPage;
