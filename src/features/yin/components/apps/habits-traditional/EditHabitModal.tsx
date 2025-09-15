// src/features/yin/components/apps/habits/EditHabitModal.tsx
'use client';

import * as Icons from 'lucide-react';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Habit } from './types';
import { getHabitColor } from './utils';

interface EditHabitModalProps {
  habit: Habit | null;
  isNew: boolean;
  onSave: (habit: Partial<Habit>) => void;
  onDelete?: (habitId: number) => void;
  onClose: () => void;
}

// Available icons for habits
const AVAILABLE_ICONS = [
  'Brain', 'Heart', 'Star', 'Sun', 'Moon', 'Cloud', 'Zap', 'Flame',
  'Book', 'PenTool', 'Palette', 'Music', 'Camera', 'Mic', 'Headphones',
  'Dumbbell', 'Activity', 'Target', 'Trophy', 'Medal', 'Flag',
  'Coffee', 'Apple', 'Droplets', 'Pizza', 'Cookie', 'Salad',
  'Users', 'MessageCircle', 'Phone', 'Mail', 'Gift', 'Smile',
  'Home', 'Briefcase', 'DollarSign', 'TrendingUp', 'Code', 'Laptop'
];

const AVAILABLE_COLORS = [
  'purple', 'blue', 'green', 'amber', 'cyan', 'indigo', 
  'pink', 'rose', 'orange', 'teal'
];

export default function EditHabitModal({
  habit,
  isNew,
  onSave,
  onDelete,
  onClose
}: EditHabitModalProps) {
  const [label, setLabel] = useState(habit?.label || '');
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon.name || 'Star');
  const [selectedColor, setSelectedColor] = useState(habit?.color || 'purple');
  const [category, setCategory] = useState(habit?.category || 'growth');
  const [notes, setNotes] = useState(habit?.notes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!label.trim()) return;
    
    // Get the actual icon component
    const IconComponent = (Icons as any)[selectedIcon] || Icons.Star;
    
    onSave({
      id: habit?.id || Date.now(),
      label: label.trim(),
      icon: IconComponent,
      color: selectedColor,
      category,
      notes,
      active: true,
      createdAt: habit?.createdAt || new Date().toISOString()
    });
  };

  const handleDelete = () => {
    if (habit?.id && onDelete) {
      onDelete(habit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 max-w-lg w-full border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isNew ? 'Create Custom Habit' : 'Edit Habit'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Habit Name</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Morning Yoga, Study Spanish"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              maxLength={30}
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Choose Icon</label>
            <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-lg">
              {AVAILABLE_ICONS.map(iconName => {
                const IconComponent = (Icons as any)[iconName];
                if (!IconComponent) return null;
                
                return (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedIcon === iconName
                        ? 'bg-purple-500/30 ring-2 ring-purple-400'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Color Theme</label>
            <div className="flex gap-2">
              {AVAILABLE_COLORS.map(color => {
                const colors = getHabitColor(color);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-lg transition-all ${colors.dot} ${
                      selectedColor === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                        : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
            >
              <option value="mindfulness" className="bg-gray-900">Mindfulness</option>
              <option value="physical" className="bg-gray-900">Physical</option>
              <option value="creative" className="bg-gray-900">Creative</option>
              <option value="social" className="bg-gray-900">Social</option>
              <option value="growth" className="bg-gray-900">Growth</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or reminders..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 
                       resize-none h-20"
              maxLength={200}
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-white/5 rounded-lg">
            <label className="block text-sm text-gray-400 mb-2">Preview</label>
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = (Icons as any)[selectedIcon] || Icons.Star;
                const colors = getHabitColor(selectedColor);
                return (
                  <>
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <IconComponent className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{label || 'Habit Name'}</p>
                      <p className="text-xs text-gray-400 capitalize">{category}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {/* Delete button - only show for existing habits */}
          {!isNew && onDelete && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-400">Delete this habit?</span>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg 
                             hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 bg-white/10 text-gray-400 rounded-lg 
                             hover:bg-white/20 transition-colors text-sm"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 
                           hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
          
          {/* Right side buttons */}
          <div className={`flex gap-2 ${isNew ? 'w-full' : 'ml-auto'}`}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg 
                       text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!label.trim()}
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg 
                       text-white transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              {isNew ? 'Create Habit' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}