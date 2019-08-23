import { expect } from 'chai';
import request from 'supertest';

import { getApp } from 'src/app';
import { login } from './login';
import User from 'src/models/User';

describe('integration tests for user resource', () => {
  describe('me - endpoint', () => {
    it('returns current user when logged in', async () => {
      const app = getApp();
      const agent = request.agent(app);

      const { id, email } = await login({ agent });

      const res = await agent.post('/graphql').send({
        query: `
            {
              me {
                id,
                email,
              }
            }
          `,
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse).to.deep.equal({
        data: {
          me: {
            id,
            email,
          },
        },
      });
    });

    it('AuthenticationError when logged out', async () => {
      const app = getApp();
      const res = await request(app)
        .post('/graphql')
        .send({
          query: `
            {
              me {
                id,
                email,
              }
            }
          `,
        });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal('Auth failed');
      expect(gqlResponse.errors[0].extensions.code).to.equal('UNAUTHENTICATED');
    });
  });

  describe('register and login flow', () => {
    it('you can register and login', async () => {
      const email = 'example@user.com';
      const password = 'P@$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const registerRes = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlRegisterResponse = JSON.parse(registerRes.text);

      const user = await User.findOne({ email });

      expect(gqlRegisterResponse).to.deep.equal({
        data: {
          register: {
            id: user.id,
            email,
          },
        },
      });

      const loginRes = await agent.post('/graphql').send({
        query: `
          mutation login($loginInput: LoginInput) {
            login(loginInput: $loginInput) {
              id
              email
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
      const gqlLoginResponse = JSON.parse(loginRes.text);

      expect(gqlLoginResponse).to.deep.equal({
        data: {
          login: {
            id: user.id,
            email,
          },
        },
      });
    });
  });

  describe('register validations', () => {
    it('is required to provide an email', async () => {
      const email = '';
      const password = 'P@$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`"email" is not allowed to be empty`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a valid email', async () => {
      const email = 'wrong_email_format';
      const password = 'P@$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`"email" must be a valid email`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it(`is required to provide an email that is not yet used`, async () => {
      const email = 'valid@email.com';
      const password = 'Pa$$w0rd';

      const user = new User({
        email,
        password,
      });
      await user.save();

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`User with such email is already registered`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password', async () => {
      const email = 'valid@email.com';
      const password = '';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password with at least one capital letter', async () => {
      const email = 'valid@email.com';
      const password = 'p@$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password with at least one small letter', async () => {
      const email = 'valid@email.com';
      const password = 'P@$$W0RD';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password with at least one digit', async () => {
      const email = 'valid@email.com';
      const password = 'P@$$word';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password with at least one special character', async () => {
      const email = 'valid@email.com';
      const password = 'Passw0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it(`is required to provide a password with min 6 characters`, async () => {
      const email = 'valid@email.com';
      const password = 'Pa$$0';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it(`is required to provide a password with max 64 characters`, async () => {
      const email = 'valid@email.com';
      const password =
        'Pa$$w0rd90' + 'Pa$$w0rd90' + 'Pa$$w0rd90' + 'Pa$$w0rd90' + 'Pa$$w0rd90' + 'Pa$$w0rd90' + '12345'; // 65 characters

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it(`is required to provide a password with no whitespace characters`, async () => {
      const email = 'valid@email.com';
      const password = 'Pa$$w0rd ';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
        query: `
          mutation register($registerInput: RegisterInput) {
            register(registerInput: $registerInput) {
              id,
              email,
            }
          }
        `,
        variables: {
          registerInput: {
            email,
            password,
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(
        `"password" must be min 6 characters, ` +
          `max 64 characters, ` +
          `have no whitespaces, ` +
          `have at least one digit, ` +
          `have at least one special character, ` +
          `have at least one small letter and ` +
          `have at least one capital letter`,
      );
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });
  });

  describe('login validations', () => {
    it('is required to provide an email', async () => {
      const email = '';
      const password = 'Pa$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
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
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`"email" is not allowed to be empty`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a password', async () => {
      const email = 'valid@email.com';
      const password = '';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
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
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`"password" is not allowed to be empty`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('BAD_USER_INPUT');
    });

    it('is required to provide a correct password for a given email', async () => {
      const email = 'valid@email.com';
      const password = 'P@$$w0rd';

      const user = new User({
        email,
        password,
      });
      await user.save();

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
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
            password: 'Wr0ngP@$$w0rd',
          },
        },
      });
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`Auth failed`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('UNAUTHENTICATED');
    });

    it('should not let user log in to unexisting account', async () => {
      const email = 'valid@email.com';
      const password = 'P@$$w0rd';

      const app = getApp();
      const agent = request.agent(app);

      const res = await agent.post('/graphql').send({
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
      const gqlResponse = JSON.parse(res.text);

      expect(gqlResponse.errors[0].message).to.equal(`Auth failed`);
      expect(gqlResponse.errors[0].extensions.code).to.equal('UNAUTHENTICATED');
    });
  });
});
