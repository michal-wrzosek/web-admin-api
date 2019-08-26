/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';

import { Subject } from 'src/util/reactive/Subject';

export interface AuthSubjectState {
  id?: string;
  email?: string;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
}

type LoginFunc = (email: string, password: string) => void;

interface AuthContextState {
  loginFunc: LoginFunc;
  authSubject: Subject<AuthSubjectState>;
}

const authSubject = new Subject<AuthSubjectState>({
  isLoggedIn: false,
  isLoggingIn: true,
});

interface User {
  id: string;
  email: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface MeData {
  me: User;
}

interface LoginData {
  login: User;
}

interface LoginVars {
  loginInput: LoginInput;
}

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      id
      email
    }
  }
`;

export const AuthContext = React.createContext<AuthContextState>({} as AuthContextState);

export const AuthProvider: React.FC = ({ children }) => {
  const { data: meData, error: meError } = useQuery<MeData>(ME_QUERY, { errorPolicy: 'all' });
  const [login, { data: loginData, error: loginError }] = useMutation<LoginData, LoginVars>(LOGIN_MUTATION, {
    errorPolicy: 'ignore',
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    isFirstRender.current = false;
  });

  const onMeUpdate = () => {
    if (meError) {
      authSubject.next({ isLoggedIn: false, isLoggingIn: false });
    }

    if (meData && meData.me) {
      const { id, email } = meData.me;
      authSubject.next({ isLoggedIn: false, isLoggingIn: false, id, email });
    }
  };

  const onLoginUpdate = () => {
    if (loginError) {
      authSubject.next({ isLoggedIn: false, isLoggingIn: false });
    }

    if (loginData) {
      const { id, email } = loginData.login;
      authSubject.next({ isLoggedIn: false, isLoggingIn: false, id, email });
    }
  };

  React.useEffect(() => {
    onMeUpdate();
  }, [meData, meError]);

  React.useEffect(() => {
    onLoginUpdate();
  }, [loginData, loginError]);

  if (isFirstRender.current) {
    onMeUpdate();
  }

  const loginFunc = async (email: string, password: string) => {
    try {
      await login({ variables: { loginInput: { email, password } } });
    } catch (error) {}
  };

  return <AuthContext.Provider value={{ loginFunc, authSubject }}>{children}</AuthContext.Provider>;
};
