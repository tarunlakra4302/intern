import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Shield, FileText, Star } from 'lucide-react';
import { Badge, Modal, FormField } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { drivers, documents } from '../../mocks';

export default function Profile() {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Get driver data
  const driverData = drivers.find(d => d.id === user?.driverId) || {};
  const driverDocuments = documents.filter(doc => doc.entityId === user?.driverId && doc.entityType === 'driver');

  const tabs = [
    { key: 'profile', label: 'Profile Information', icon: User },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">My Profile</h1>
          <p className="text-base-content/60 mt-1">Manage your personal information and settings</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {driverData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{driverData.name || 'Unknown User'}</h2>
              <p className="text-base-content/60">{driverData.id || 'No ID'}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge color={
                  driverData.status === 'active' ? 'success' :
                  driverData.status === 'inactive' ? 'error' :
                  'warning'
                }>
                  {driverData.status || 'Unknown'}
                </Badge>
                {driverData.rating && (
                  <Badge color="warning" variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    {driverData.rating}/5
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-outline btn-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button className="btn btn-outline btn-sm">
                <Camera className="w-4 h-4 mr-2" />
                Update Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-lifted">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab tab-lg ${activeTab === tab.key ? 'tab-active' : ''}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">Email</p>
                      <p className="font-medium">{driverData.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">Phone</p>
                      <p className="font-medium">{driverData.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">Address</p>
                      <p className="font-medium">{driverData.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">Date of Birth</p>
                      <p className="font-medium">{driverData.dateOfBirth || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">License Number</p>
                      <p className="font-medium">{driverData.licenseNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-base-content/60" />
                    <div>
                      <p className="text-sm text-base-content/60">License Expiry</p>
                      <p className="font-medium">{driverData.licenseExpiry || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Documents</h3>
                <button className="btn btn-primary btn-sm">
                  Upload Document
                </button>
              </div>
              <div className="space-y-3">
                {driverDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-base-content/30 mb-2" />
                    <p className="text-base-content/60">No documents uploaded</p>
                  </div>
                ) : (
                  driverDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-base-content/60" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-base-content/60">Type: {doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge color={
                          doc.status === 'active' ? 'success' :
                          doc.status === 'expired' ? 'error' :
                          'warning'
                        }>
                          {doc.status}
                        </Badge>
                        <button className="btn btn-outline btn-sm">View</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-base-content/60">Last updated 30 days ago</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-base-content/60">Add an extra layer of security</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Enable</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                type="text"
                value={driverData.name || ''}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={driverData.email || ''}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Phone"
                type="tel"
                value={driverData.phone || ''}
                required
              />
              <FormField
                label="Date of Birth"
                type="date"
                value={driverData.dateOfBirth || ''}
              />
            </div>
            <FormField
              label="Address"
              type="textarea"
              value={driverData.address || ''}
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="space-y-4">
            <FormField
              label="Current Password"
              type="password"
              required
            />
            <FormField
              label="New Password"
              type="password"
              required
            />
            <FormField
              label="Confirm New Password"
              type="password"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Update Password
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}