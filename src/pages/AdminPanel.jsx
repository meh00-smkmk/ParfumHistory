/**
 * Admin Panel - Developer Only
 * Access this page for admin utilities like license generation
 * 
 * Route: /admin (hidden from regular UI)
 */

import React from 'react';
import AdminLicenseGenerator from '@/components/AdminLicenseGenerator';

const AdminPanel = () => {
  return (
    <div style={styles.wrapper}>
      <AdminLicenseGenerator />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: 'var(--color-background)',
    minHeight: '100vh',
    padding: '20px'
  }
};

export default AdminPanel;
