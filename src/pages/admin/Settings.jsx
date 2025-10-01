import { useState } from 'react';
import { Save, Building2, Palette, Mail, MapPin, DollarSign, Key, CheckCircle } from 'lucide-react';
import { FormField } from '../../components/common';
import { useTheme } from '../../components/ui/ThemeProvider';

export default function Settings() {
  const { theme, themes, setTheme } = useTheme();

  // Company settings state
  const [companySettings, setCompanySettings] = useState({
    name: 'FleetCo Transport Solutions',
    abn: '12 345 678 901',
    address: '123 Industrial Drive',
    suburb: 'Alexandria',
    state: 'NSW',
    postcode: '2015',
    country: 'Australia',
    phone: '+61 2 9876 5432',
    email: 'admin@fleetco.com.au',
    website: 'www.fleetco.com.au'
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    currency: 'AUD',
    currencySymbol: '$',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'Australia/Sydney'
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'admin@fleetco.com.au',
    smtpPassword: '',
    smtpSecurity: 'tls',
    fromName: 'FleetCo Transport',
    fromEmail: 'admin@fleetco.com.au'
  });

  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState({
    googleMapsApiKey: '',
    enableGpsTracking: true,
    enableNotifications: true,
    backupFrequency: 'daily'
  });

  const [activeTab, setActiveTab] = useState('company');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = (settingsType) => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
    console.log(`Saving ${settingsType} settings:`, {
      company: companySettings,
      system: systemSettings,
      email: emailSettings,
      integration: integrationSettings
    }[settingsType]);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'integration', label: 'Integration', icon: MapPin }
  ];

  const currencies = [
    { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: '$' },
    { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
    { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' }
  ];

  const timezones = [
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Adelaide',
    'Australia/Perth',
    'Australia/Darwin'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Settings</h1>
          <p className="text-base-content/60 mt-1">
            Configure your fleet management system
          </p>
        </div>
        {saveStatus && (
          <div className={`alert alert-sm ${
            saveStatus === 'saving' ? 'alert-info' :
            saveStatus === 'saved' ? 'alert-success' : ''
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Settings saved successfully!'}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="w-full lg:w-64">
          <div className="menu bg-base-100 shadow rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`menu-item flex items-center gap-3 p-3 rounded-lg w-full text-left ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Company Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormField
                        label="Company Name *"
                        name="name"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings(prev => ({...prev, name: e.target.value}))}
                        required
                      />
                    </div>
                    <FormField
                      label="ABN"
                      name="abn"
                      value={companySettings.abn}
                      onChange={(e) => setCompanySettings(prev => ({...prev, abn: e.target.value}))}
                      placeholder="12 345 678 901"
                    />
                    <FormField
                      label="Phone *"
                      name="phone"
                      type="tel"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings(prev => ({...prev, phone: e.target.value}))}
                      required
                    />
                    <FormField
                      label="Email *"
                      name="email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                    <FormField
                      label="Website"
                      name="website"
                      type="url"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings(prev => ({...prev, website: e.target.value}))}
                    />
                  </div>

                  <div className="divider">Address</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        label="Street Address *"
                        name="address"
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings(prev => ({...prev, address: e.target.value}))}
                        required
                      />
                    </div>
                    <FormField
                      label="Suburb *"
                      name="suburb"
                      value={companySettings.suburb}
                      onChange={(e) => setCompanySettings(prev => ({...prev, suburb: e.target.value}))}
                      required
                    />
                    <FormField
                      label="State *"
                      name="state"
                      value={companySettings.state}
                      onChange={(e) => setCompanySettings(prev => ({...prev, state: e.target.value}))}
                      required
                    />
                    <FormField
                      label="Postcode *"
                      name="postcode"
                      value={companySettings.postcode}
                      onChange={(e) => setCompanySettings(prev => ({...prev, postcode: e.target.value}))}
                      required
                    />
                    <FormField
                      label="Country *"
                      name="country"
                      value={companySettings.country}
                      onChange={(e) => setCompanySettings(prev => ({...prev, country: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('company')}
                      className="btn btn-primary"
                      disabled={saveStatus === 'saving'}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Company Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Appearance</h2>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
                    <p className="text-base-content/60 mb-4">
                      Choose your preferred color theme. Changes apply immediately.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {themes.map((themeName) => (
                        <button
                          key={themeName}
                          onClick={() => handleThemeChange(themeName)}
                          className={`btn btn-outline capitalize ${
                            theme === themeName ? 'btn-primary' : ''
                          }`}
                          data-theme={themeName}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                            {themeName}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divider">Preview</div>

                  <div className="mockup-window border bg-base-300">
                    <div className="flex justify-center px-4 py-16 bg-base-200">
                      <div className="space-y-4 w-full max-w-md">
                        <div className="card bg-base-100 shadow">
                          <div className="card-body">
                            <h3 className="card-title text-primary">Preview Card</h3>
                            <p className="text-base-content/70">This is how your interface will look with the selected theme.</p>
                            <div className="card-actions justify-end">
                              <button className="btn btn-primary btn-sm">Primary</button>
                              <button className="btn btn-secondary btn-sm">Secondary</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">System Configuration</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Currency"
                      name="currency"
                      type="select"
                      value={systemSettings.currency}
                      onChange={(e) => {
                        const currency = currencies.find(c => c.value === e.target.value);
                        setSystemSettings(prev => ({
                          ...prev,
                          currency: e.target.value,
                          currencySymbol: currency?.symbol || '$'
                        }));
                      }}
                      options={currencies.map(currency => ({
                        value: currency.value,
                        label: currency.label
                      }))}
                    />
                    <FormField
                      label="Date Format"
                      name="dateFormat"
                      type="select"
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings(prev => ({...prev, dateFormat: e.target.value}))}
                      options={[
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                      ]}
                    />
                    <FormField
                      label="Time Format"
                      name="timeFormat"
                      type="select"
                      value={systemSettings.timeFormat}
                      onChange={(e) => setSystemSettings(prev => ({...prev, timeFormat: e.target.value}))}
                      options={[
                        { value: '24h', label: '24 Hour' },
                        { value: '12h', label: '12 Hour' }
                      ]}
                    />
                    <FormField
                      label="Timezone"
                      name="timezone"
                      type="select"
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings(prev => ({...prev, timezone: e.target.value}))}
                      options={timezones.map(tz => ({ value: tz, label: tz }))}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('system')}
                      className="btn btn-primary"
                      disabled={saveStatus === 'saving'}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save System Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Email Configuration</h2>
                  </div>

                  <div className="alert alert-info">
                    <Mail className="w-5 h-5" />
                    <span>Configure SMTP settings to send invoices and notifications via email.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="SMTP Host *"
                      name="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({...prev, smtpHost: e.target.value}))}
                      placeholder="smtp.gmail.com"
                      required
                    />
                    <FormField
                      label="SMTP Port *"
                      name="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({...prev, smtpPort: e.target.value}))}
                      placeholder="587"
                      required
                    />
                    <FormField
                      label="Username *"
                      name="smtpUsername"
                      type="email"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings(prev => ({...prev, smtpUsername: e.target.value}))}
                      required
                    />
                    <FormField
                      label="Password *"
                      name="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings(prev => ({...prev, smtpPassword: e.target.value}))}
                      placeholder="••••••••"
                      required
                    />
                    <FormField
                      label="Security"
                      name="smtpSecurity"
                      type="select"
                      value={emailSettings.smtpSecurity}
                      onChange={(e) => setEmailSettings(prev => ({...prev, smtpSecurity: e.target.value}))}
                      options={[
                        { value: 'tls', label: 'TLS' },
                        { value: 'ssl', label: 'SSL' },
                        { value: 'none', label: 'None' }
                      ]}
                    />
                  </div>

                  <div className="divider">Email Display Settings</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="From Name"
                      name="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({...prev, fromName: e.target.value}))}
                      placeholder="FleetCo Transport"
                    />
                    <FormField
                      label="From Email"
                      name="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({...prev, fromEmail: e.target.value}))}
                      placeholder="admin@fleetco.com.au"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button className="btn btn-outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Test Connection
                    </button>
                    <button
                      onClick={() => handleSave('email')}
                      className="btn btn-primary"
                      disabled={saveStatus === 'saving'}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Email Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Integration Settings */}
              {activeTab === 'integration' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Integration Settings</h2>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Google Maps Integration</h3>
                    <FormField
                      label="Google Maps API Key"
                      name="googleMapsApiKey"
                      type="password"
                      value={integrationSettings.googleMapsApiKey}
                      onChange={(e) => setIntegrationSettings(prev => ({...prev, googleMapsApiKey: e.target.value}))}
                      placeholder="Enter your Google Maps API key"
                      helper="Used for route optimization and location services"
                    />
                  </div>

                  <div className="divider">System Features</div>

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          <strong>GPS Tracking</strong>
                          <div className="text-sm text-base-content/60">Enable real-time vehicle tracking</div>
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={integrationSettings.enableGpsTracking}
                          onChange={(e) => setIntegrationSettings(prev => ({...prev, enableGpsTracking: e.target.checked}))}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          <strong>Push Notifications</strong>
                          <div className="text-sm text-base-content/60">Send notifications for important events</div>
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={integrationSettings.enableNotifications}
                          onChange={(e) => setIntegrationSettings(prev => ({...prev, enableNotifications: e.target.checked}))}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <FormField
                      label="Backup Frequency"
                      name="backupFrequency"
                      type="select"
                      value={integrationSettings.backupFrequency}
                      onChange={(e) => setIntegrationSettings(prev => ({...prev, backupFrequency: e.target.value}))}
                      options={[
                        { value: 'hourly', label: 'Every Hour' },
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' }
                      ]}
                      helper="How often to backup system data"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('integration')}
                      className="btn btn-primary"
                      disabled={saveStatus === 'saving'}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Integration Settings'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}