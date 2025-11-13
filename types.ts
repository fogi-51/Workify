import React from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum ToolCategory {
  AIWritingAids = 'AI Writing Aids',
  DocumentEditing = 'Document Editing',
  DataConversion = 'Data Conversion',
  CreativeTools = 'Creative Tools',
  Utilities = 'Utilities',
}

export interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface ToolConfig {
  systemInstruction: string;
  inputLabel: string;
  fields?: ToolField[];
  showChatHistory?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  // FIX: Specified that the icon element can accept a className prop to resolve type errors with React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
  component: React.ComponentType;
  config?: ToolConfig;
}

export interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  activeToolId: string;
  setActiveToolId: (id: string) => void;
}