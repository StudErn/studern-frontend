import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Search,
  Plus,
  X,
} from 'lucide-react';

const MemberManagement = () => {
  const { companyId } = useParams();
  const {
    getCompanyUsers,
    addUserToCompany,
    manageUserPrivileges,
    hasPrivilege,
    loading,
  } = useCompany();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserError, setAddUserError] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  const canAddMembers = hasPrivilege('can_add_members');
  const canManagePrivileges = hasPrivilege('can_manage_privileges');

  const availablePrivileges = [
    { code: 'can_post_jobs', name: 'Post Jobs', description: 'Create new job postings' },
    {
      code: 'can_manage_jobs',
      name: 'Manage Jobs',
      description: 'Edit and delete job postings',
    },
    { code: 'can_view_jobs', name: 'View Jobs', description: 'View all job postings' },
    {
      code: 'can_add_members',
      name: 'Add Members',
      description: 'Invite new members to company',
    },
    {
      code: 'can_manage_privileges',
      name: 'Manage Privileges',
      description: 'Assign and revoke member privileges',
    },
    {
      code: 'can_edit_company',
      name: 'Edit Company',
      description: 'Update company information',
    },
    {
      code: 'can_delete_company',
      name: 'Delete Company',
      description: 'Delete the company (admin only)',
    },
  ];

  useEffect(() => {
    loadMembers();
  }, [companyId]);

  const loadMembers = async () => {
    const result = await getCompanyUsers(companyId);
    if (result.success) {
      setMembers(result.data);
    }
  };

  const handleAddMember = async () => {
    setAddUserError('');
    if (!addUserEmail.trim()) {
      setAddUserError('Email is required');
      return;
    }

    const result = await addUserToCompany(companyId, addUserEmail);
    if (result.success) {
      setShowAddModal(false);
      setAddUserEmail('');
      loadMembers();
    } else {
      setAddUserError(result.message);
    }
  };

  const handleEditPrivileges = (member) => {
    setEditingMember(member);
    setSelectedPrivileges(member.privileges.map((p) => p.privilege_code));
  };

  const handleSavePrivileges = async () => {
    if (!editingMember) return;

    const result = await manageUserPrivileges(
      companyId,
      editingMember.user_id,
      selectedPrivileges
    );

    if (result.success) {
      setEditingMember(null);
      setSelectedPrivileges([]);
      loadMembers();
    }
  };

  const togglePrivilege = (code) => {
    setSelectedPrivileges((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const filteredMembers = members.filter(
    (m) =>
      m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-[#00B8D4]" />
            Team Members
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your company team and their permissions
          </p>
        </div>
        {canAddMembers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
          />
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4]"></div>
          <p className="text-gray-600 mt-4">Loading members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search' : 'Add members to your team'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Privileges
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#0097a7] rounded-full flex items-center justify-center text-white font-bold">
                          {member.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {member.user?.name || 'User'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.is_admin
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {member.is_admin ? 'Admin' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {member.privileges.length > 0 ? (
                          member.privileges.slice(0, 2).map((priv) => (
                            <span
                              key={priv.id}
                              className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                            >
                              {priv.privilege?.name || priv.privilege_code}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No privileges</span>
                        )}
                        {member.privileges.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{member.privileges.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {canManagePrivileges && !member.is_admin && (
                        <button
                          onClick={() => handleEditPrivileges(member)}
                          className="flex items-center gap-1 px-3 py-1 text-[#00B8D4] border border-[#00B8D4] rounded hover:bg-[#00B8D4] hover:text-white transition text-sm font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          Manage
                        </button>
                      )}
                      {member.is_admin && (
                        <span className="text-xs text-gray-500">Admin (Full Access)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#00B8D4]" />
                Add Team Member
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddUserEmail('');
                  setAddUserError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {addUserError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {addUserError}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={addUserEmail}
                  onChange={(e) => setAddUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  The user will be added to your company. You can manage their privileges
                  after adding them.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddUserEmail('');
                    setAddUserError('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Privileges Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#00B8D4]" />
                Manage Privileges - {editingMember.user?.name}
              </h2>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setSelectedPrivileges([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {availablePrivileges.map((priv) => (
                  <label
                    key={priv.code}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPrivileges.includes(priv.code)}
                      onChange={() => togglePrivilege(priv.code)}
                      className="mt-1 w-5 h-5 text-[#00B8D4] focus:ring-[#00B8D4] rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{priv.name}</div>
                      <div className="text-sm text-gray-600">{priv.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setSelectedPrivileges([]);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrivileges}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Privileges'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
