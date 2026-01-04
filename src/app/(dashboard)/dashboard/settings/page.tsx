"use client";

import { useState } from "react";
import { Settings, Key, User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and API configurations</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      {/* API Keys Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Configure your API keys to enable AI chat and market data features.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anthropic API Key
            </label>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">For Claude AI conversations</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">For GPT AI conversations</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Polygon API Key
            </label>
            <input
              type="password"
              placeholder="Enter your Polygon API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">For real-time market data</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pinecone API Key
            </label>
            <input
              type="password"
              placeholder="Enter your Pinecone API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">For AI memory and context</p>
          </div>
        </div>
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
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default AI Provider
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="anthropic">Claude (Anthropic)</option>
              <option value="openai">GPT (OpenAI)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Chart Timeframe
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Enable AI Memory</p>
              <p className="text-xs text-gray-400">Store conversation context for better responses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          <Save className="h-5 w-5" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}
