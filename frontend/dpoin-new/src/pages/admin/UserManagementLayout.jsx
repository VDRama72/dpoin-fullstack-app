//src/pages/admin/UserManagementLayout.jsx

import SidebarAdmin from '../../components/admin/SidebarAdmin';
import UserManagement from './UserManagement';

export default function UserManagementLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <UserManagement />
      </div>
    </div>
  );
}
