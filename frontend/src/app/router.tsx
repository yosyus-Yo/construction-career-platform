import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { JobsPage } from '../pages/JobsPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CompanyPage } from '../pages/CompanyPage';
import { AdminPage } from '../pages/AdminPage';
import { RoleGuard } from '../guards/RoleGuard';
import { ApplyFlowPage } from '../pages/ApplyFlowPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'apply-flow', element: <ApplyFlowPage /> },
      { path: 'dashboard', element: <RoleGuard allow={['CANDIDATE', 'RECRUITER', 'ADMIN']}><DashboardPage /></RoleGuard> },
      { path: 'company', element: <RoleGuard allow={['RECRUITER']}><CompanyPage /></RoleGuard> },
      { path: 'admin', element: <RoleGuard allow={['ADMIN']}><AdminPage /></RoleGuard> },
    ],
  },
]);
