import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, Role } from '../types';
import { Shield, Trash2, Edit2 } from 'lucide-react';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.admin.getUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm hover:bg-blue-700">
            + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                            <span className="font-medium text-slate-800">{user.name}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 
                                ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                                {user.role === Role.ADMIN && <Shield size={10}/>}
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                             <button className="text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                             <button className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};