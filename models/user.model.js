const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
    },
    photo: {
      type: String,
      required: [true, 'Please enter your password'],
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQzg2-modiBeSBIckt_NcpipPPGQfZA_dbQ&usqp=CAU',
    },
    phone: {
      type: String,
      default: '+234',
    },
    bio: {
        type: String,
        default: 'bio',
    },
    role: {
        type: String,
        required: true,
        default: 'sunscriber',
    },
    isVerified: {
        type: Boolean,
        default: 'false',
    },
    userAgent: {
        type: Array,
        required: true,
        default: [],
      },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
