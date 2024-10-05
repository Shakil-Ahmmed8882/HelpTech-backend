import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import { createToken } from '../Auth/auth.utils';
import { UserSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import { User } from './user.model';
import bcryptJs from 'bcryptjs';
const createUser = async (user: IUser) => {
  user.password = await bcryptJs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  return await User.create(user);
};

const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const metaData = await userQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const updateUserById = async (userId: string, payload: Partial<IUser>) => {

  
  console.log({userId,payload})


  const user = await User.findByIdAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });



  const jwtPayload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const deleteUserById = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const UserService = {
  createUser,
  findUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
