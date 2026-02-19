import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Role } from '../api';

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
