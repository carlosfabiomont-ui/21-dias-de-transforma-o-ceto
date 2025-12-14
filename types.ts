import React from 'react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GUIDE = 'GUIDE',
  RECIPES = 'RECIPES',
  TRACKER = 'TRACKER',
  SETTINGS = 'SETTINGS',
  LEGAL = 'LEGAL'
}

export interface Recipe {
  id: number;
  title: string;
  category: 'Café da Manhã' | 'Almoço' | 'Lanche' | 'Jantar';
  prepTime: string;
  ingredients: string[];
  instructions?: string;
  variations: string[];
  tags: string[];
}

export interface DailyLog {
  id: string; // Unique ID for React keys
  date: string; // ISO Date
  displayDate: string; // Readable Date
  weight: string;
  energy: number; // 1-10
  sleep: string; // hours (changed to string to handle inputs easier)
  notes?: string;
}

export interface UserSettings {
  name: string;
  startDate: string;
  currentDay: number;
  targetWeight?: string;
  startingWeight?: string;
  height?: string;
  activityLevel?: string;
  previousDiet?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  icon: any; // Lucide icon component
  content: React.ReactNode;
}

export interface DailyGuidance {
  day: number;
  phase: string;
  title: string;
  action: string;
  why: string; // The "Science" or reason behind it
  icon: any;
  mealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  exercise: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}