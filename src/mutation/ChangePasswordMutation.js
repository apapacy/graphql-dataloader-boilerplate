import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import {
  mutationWithClientMutationId,
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';
import MeType from '../type/MeType';

export default mutationWithClientMutationId({
  name: 'ChangePassword',
  inputFields: {
    oldPassword: {
      type: GraphQLString,
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user new password',
    },
  },
  mutateAndGetPayload: async ({oldPassword, password}, {user}) => {
    if(!user) {
      throw new Error('invalid user');
    }

    const correctPassword = await user.authenticate(oldPassword);

    if (!correctPassword) {
      return {
        error: 'INVALID_PASSWORD',
      };
    }

    user.password = password;
    await user.save();

    return {
      error: null,
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({error}) => error,
    },
    me: {
      type: MeType,
      resolve: (obj, args, context) => {
        return context.user;
      },
    }
  },
});
