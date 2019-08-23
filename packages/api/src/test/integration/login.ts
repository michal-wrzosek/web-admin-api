import { SuperTest, Test } from 'supertest';

import User from 'src/models/User';

interface LoginProps {
  agent: SuperTest<Test>;
  email?: string;
  password?: string;
}

export const login = async ({ agent, email = 'test@example.com', password = 'test_password' }: LoginProps) => {
  const user = new User({
    email,
    password,
  });
  await user.save();

  await agent.post('/graphql').send({
    query: `
      mutation login($loginInput: LoginInput) {
        login(loginInput: $loginInput) {
          id
        }
      }
    `,
    variables: {
      loginInput: {
        email,
        password,
      },
    },
  });

  return {
    id: user.id,
    email,
    password,
  };
};
