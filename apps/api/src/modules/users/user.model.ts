import { LANGUAGES, ROLES, type Language, type Role } from '@arivuvazhi/shared';
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions } from '../../lib/mongoose';

export interface StudentProfile {
  targetExamId?: Types.ObjectId;
  targetDate?: Date;
  dailyStudyMinutes?: number;
}

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  preferredLanguage: Language;
  studentProfile?: StudentProfile;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const studentProfileSchema = new Schema<StudentProfile>(
  {
    targetExamId: { type: Schema.Types.ObjectId, ref: 'Exam' },
    targetDate: Date,
    dailyStudyMinutes: Number,
  },
  { _id: false },
);

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true, default: 'student', index: true },
    isActive: { type: Boolean, default: true },
    preferredLanguage: { type: String, enum: LANGUAGES, default: 'en' },
    studentProfile: studentProfileSchema,
    lastLoginAt: Date,
  },
  baseSchemaOptions(['passwordHash']),
);

export const UserModel = model<User>('User', userSchema);
