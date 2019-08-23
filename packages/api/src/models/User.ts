import { Schema, model, Document, Model } from 'mongoose';
import { hash, compare } from 'bcrypt';

export interface UserProps {
  email: string;
  password: string;
}

export interface UserSerializedProps {
  _id: string;
  email: string;
}

export interface UserModelProps extends UserProps, Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserModelProps> {
  serialize: (user: UserModelProps) => UserSerializedProps;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

userSchema.statics.serialize = (provider: UserModelProps): UserSerializedProps => ({
  _id: provider._id.toString(),
  email: provider.email,
});

userSchema.pre<UserModelProps>('save', function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    this.password = passwordHash;
    next();
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return new Promise((resolve, reject) => {
    compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = model('User', userSchema) as UserModel;

export default User;
