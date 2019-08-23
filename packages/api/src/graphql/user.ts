import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';

import User, { UserModelProps, UserProps } from 'src/models/User';
import {
  JWT_SECRET,
  NODE_ENV,
  AUTH_TOKEN_MAX_AGE_IN_SECONDS,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from 'src/configuration';
import { NODE_ENVS } from 'src/types/NodeEnvs';
import { ApolloContext, UserData } from 'src/types/ApolloContext';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

export function getToken(user: UserModelProps) {
  const userData: UserData = {
    _id: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(userData, JWT_SECRET, {
    expiresIn: AUTH_TOKEN_MAX_AGE_IN_SECONDS,
  });
}

const loginSchema = Joi.object().keys({
  email: Joi.string()
    .min(1)
    .required(),
  password: Joi.string()
    .min(1)
    .required(),
});

const registerSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .regex(/^\S+$/) // no whitespace characters
    .regex(/^\S*\d\S*$/) // at least one digit
    .regex(/^\S*\W\S*$/) // at least one special character
    .regex(/^\S*[a-z]\S*$/) // at least one small letter
    .regex(/^\S*[A-Z]\S*$/) // at least one capital letter
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required()
    .error(
      () =>
        `"password" must be min ${USER_PASSWORD_MIN_LENGTH} characters, ` +
        `max ${USER_PASSWORD_MAX_LENGTH} characters, ` +
        `have no whitespaces, ` +
        `have at least one digit, ` +
        `have at least one special character, ` +
        `have at least one small letter and ` +
        `have at least one capital letter`,
    ),
});

export const userResolvers = {
  Query: {
    async me(_: any, __: any, { userData }: ApolloContext) {
      try {
        if (!userData) throw new AuthenticationError('Auth failed');

        const user = await User.findOne({ email: userData.email }).exec();

        // No such user
        if (!user) throw new AuthenticationError('Auth failed');

        return user;
      } catch (error) {
        throw error;
      }
    },
    users: () => User.find(),
  },
  Mutation: {
    async login(_: any, { loginInput }: { loginInput: LoginInput }, { res }: ApolloContext) {
      try {
        const { error: validationErrors } = loginSchema.validate(loginInput);
        if (!!validationErrors) throw new UserInputError(validationErrors.details.map(e => e.message).join('; '));

        const user = await User.findOne({ email: loginInput.email }, '+password').exec();

        // No such user
        if (!user) throw new AuthenticationError('Auth failed');

        const isMatch = await user.comparePassword(loginInput.password);

        // Wrong password
        if (!isMatch) throw new AuthenticationError('Auth failed');

        // Send new token
        const token = getToken(user);

        // Set cookie
        res.cookie('authorization', `Bearer ${token}`, {
          httpOnly: true,
          secure: NODE_ENV !== NODE_ENVS.DEVELOPMENT,
          maxAge: 1000 * AUTH_TOKEN_MAX_AGE_IN_SECONDS,
        });

        return user;
      } catch (error) {
        throw error;
      }
    },
    logout(_: any, __: any, { res }: ApolloContext) {
      res.clearCookie('authorization');
      return true;
    },
    async register(_: any, { registerInput }: { registerInput: RegisterInput }, { res }: ApolloContext) {
      try {
        const { error: validationErrors } = registerSchema.validate(registerInput);
        if (!!validationErrors) throw new UserInputError(validationErrors.details.map(e => e.message).join('; '));

        const props: UserProps = {
          email: registerInput.email,
          password: registerInput.password,
        };

        const userAlreadyRegistered = await User.findOne({ email: registerInput.email });

        if (!!userAlreadyRegistered) throw new UserInputError('User with such email is already registered');

        const user = new User(props);

        const token = getToken(user);

        res.cookie('authorization', `Bearer ${token}`, {
          httpOnly: true,
          secure: NODE_ENV !== NODE_ENVS.DEVELOPMENT,
          maxAge: 1000 * AUTH_TOKEN_MAX_AGE_IN_SECONDS,
        });

        return await user.save();
      } catch (error) {
        throw error;
      }
    },
  },
};
