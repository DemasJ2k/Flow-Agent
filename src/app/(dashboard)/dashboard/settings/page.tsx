"use client";

import { useState, useEffect } from "react";
import { Settings, User, TrendingUp, Save, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserSettings {
  preferredProvider: string;
  anthropicModel: string;
  openaiModel: string;
  theme: string;
  timezone: string;
  defaultMarket: string;
  defaultTimeframe: string;
  riskPerTrade: number;
  emailNotifications: boolean;
}

interface UserProfile {
  name: string | null;
  email: string;
}

export default function SettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
  const [settings, setSettings] = useState<UserSettings>({
    preferredProvider: 'anthropic',
    anthropicModel: 'claude-3-sonnet-20240229',
    openaiModel: 'gpt-4-turbo-preview',
    theme: 'system',
    timezone: 'UTC',
    defaultMarket: 'forex',
    defaultTimeframe: '1h',
    riskPerTrade: 1.0,
    emailNotifications: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        success('Settings saved successfully');
      } else {
        const data = await response.json();
        error(data.error || 'Failed to save settings');
      }
    } catch (err) {
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updateData: { name?: string; currentPassword?: string; newPassword?: string } = {};

      if (profile.name) {
        updateData.name = profile.name;
      }

      if (passwordForm.newPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          error('Passwords do not match');
          setSavingProfile(false);
          return;
        }
        if (passwordForm.newPassword.length < 8) {
          error('Password must be at least 8 characters');
          setSavingProfile(false);
          return;
        }
        updateData.currentPassword = passwordForm.currentPassword;
        updateData.newPassword = passwordForm.newPassword;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        success('Profile updated successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <Input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Change Password</h3>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <Input
                type="password"
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </div>
      </div>

      {/* AI Provider Preferences */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default AI Provider
            </label>
            <select
              value={settings.preferredProvider}
              onChange={(e) => setSettings({ ...settings, preferredProvider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="anthropic">Claude (Anthropic)</option>
              <option value="openai">GPT (OpenAI)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Claude Model
            </label>
            <select
              value={settings.anthropicModel}
              onChange={(e) => setSettings({ ...settings, anthropicModel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI Model
            </label>
            <select
              value={settings.openaiModel}
              onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trading Preferences */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Trading Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Market
            </label>
            <select
              value={settings.defaultMarket}
              onChange={(e) => setSettings({ ...settings, defaultMarket: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="forex">Forex</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="stocks">Stocks</option>
              <option value="metals">Metals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Chart Timeframe
            </label>
            <select
              value={settings.defaultTimeframe}
              onChange={(e) => setSettings({ ...settings, defaultTimeframe: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Per Trade (%)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="10"
              value={settings.riskPerTrade}
              onChange={(e) => setSettings({ ...settings, riskPerTrade: parseFloat(e.target.value) || 1 })}
            />
            <p className="text-xs text-gray-400 mt-1">Recommended: 1-2% per trade</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Singapore">Singapore (SGT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Keys Note */}
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">API Keys Configuration</h3>
            <p className="text-sm text-yellow-700 mt-1">
              API keys (Anthropic, OpenAI, Polygon, Pinecone) are configured via environment variables
              for security. Contact your administrator to update these settings.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
