import React from 'react';
import AdminStoreDashboard from '../components/store/AdminStoreDashboard';

const AdminStorePage: React.FC = () => {
  return (
    <section className="pt-32 pb-16">
      <div className="container-custom">
        <AdminStoreDashboard />
      </div>
    </section>
  );
};

export default AdminStorePage;
