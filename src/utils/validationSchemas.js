import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const createSuperAdminSchema = yup.object({
  fullName: yup.string().trim().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  isActive: yup.boolean(),
});

export const updateSuperAdminSchema = yup.object({
  fullName: yup.string().trim(),
  isActive: yup.boolean(),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .nullable()
    .transform((v) => (v === '' ? null : v)),
});

const urlRule = yup
  .string()
  .url('Must be a valid URL (include http:// or https://)')
  .required('URL is required');

export const serverConfigSchema = yup.object({
  apiBaseUrl: urlRule,
  adminPanelUrl: urlRule,
  superAdminPanelUrl: urlRule,
  playStoreUrl: urlRule,
  maintenanceMode: yup.boolean(),
  maintenanceMessage: yup.string().trim().required('Maintenance message is required'),
});

export const appVersionSchema = yup.object({
  latestAppVersion: yup
    .string()
    .matches(/^\d+\.\d+\.\d+$/, 'Must be semantic version (e.g., 1.2.0)')
    .required('Required'),
  minimumAppVersion: yup
    .string()
    .matches(/^\d+\.\d+\.\d+$/, 'Must be semantic version (e.g., 1.0.0)')
    .required('Required'),
  forceUpdate: yup.boolean(),
  updateAvailableMessage: yup.string().trim().required('Message is required'),
});

export const broadcastNoticeSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  body: yup.string().trim().required('Body is required'),
  expiryHours: yup.number().positive('Must be positive').integer().min(1, 'Min 1 hour').required('Required'),
});