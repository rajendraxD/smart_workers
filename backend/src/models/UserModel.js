import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// userSchema.methods.comparePassword = function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
