import React from 'react';
import { AuthContext, AuthSubjectState } from 'src/context/AuthContext';

export const LoginScreen: React.FC = ({ children }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { loginFunc, authSubject } = React.useContext(AuthContext);
  const [state, setState] = React.useState<AuthSubjectState>(authSubject.getValue());

  authSubject.subscribe(value => {
    setState(value);
  });

  if (state.isLoggingIn) return <div>Logging in...</div>;

  if (state.id) return <div>{children}</div>;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    loginFunc(email, password);
  };

  return (
    <React.Fragment>
      <form onSubmit={handleFormSubmit}>
        <input type="email" name="email" onChange={e => setEmail(e.target.value)} value={email} />
        <input type="password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
        <button type="submit">Log in</button>
      </form>
    </React.Fragment>
  );
};
