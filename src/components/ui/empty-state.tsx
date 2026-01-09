'use client';

import { ReactNode } from 'react';
import {
  FileText,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Wrench,
  BookMarked,
  Search,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: 'document' | 'chat' | 'journal' | 'strategy' | 'tool' | 'playbook' | 'search' | 'chart';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

const iconMap = {
  document: FileText,
  chat: MessageSquare,
  journal: BookOpen,
  strategy: Lightbulb,
  tool: Wrench,
  playbook: BookMarked,
  search: Search,
  chart: TrendingUp,
};

export function EmptyState({
  icon = 'document',
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
