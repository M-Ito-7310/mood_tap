import { describe, it, expect } from 'vitest';
import { calculateAverageMood, calculateStreak, getMoodExtremes, getWeeklyData } from '../stats';
import { MoodEntry } from '@/types/mood';

describe('Statistics Functions', () => {
  describe('calculateAverageMood', () => {
    it('should return 0 for empty array', () => {
      expect(calculateAverageMood([])).toBe(0);
    });

    it('should calculate average mood correctly', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-01', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: '2', date: '2025-01-02', moodScore: 3, moodLabel: 'okay', createdAt: '2025-01-02T00:00:00Z', updatedAt: '2025-01-02T00:00:00Z' },
        { id: '3', date: '2025-01-03', moodScore: 4, moodLabel: 'good', createdAt: '2025-01-03T00:00:00Z', updatedAt: '2025-01-03T00:00:00Z' },
      ];
      expect(calculateAverageMood(entries)).toBe(4.0);
    });

    it('should round to 1 decimal place', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-01', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: '2', date: '2025-01-02', moodScore: 3, moodLabel: 'okay', createdAt: '2025-01-02T00:00:00Z', updatedAt: '2025-01-02T00:00:00Z' },
      ];
      expect(calculateAverageMood(entries)).toBe(4.0);
    });
  });

  describe('getMoodExtremes', () => {
    it('should return null for empty array', () => {
      expect(getMoodExtremes([])).toEqual({ highest: null, lowest: null });
    });

    it('should find highest and lowest mood scores', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-01', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: '2', date: '2025-01-02', moodScore: 1, moodLabel: 'terrible', createdAt: '2025-01-02T00:00:00Z', updatedAt: '2025-01-02T00:00:00Z' },
        { id: '3', date: '2025-01-03', moodScore: 3, moodLabel: 'okay', createdAt: '2025-01-03T00:00:00Z', updatedAt: '2025-01-03T00:00:00Z' },
      ];
      expect(getMoodExtremes(entries)).toEqual({ highest: 5, lowest: 1 });
    });

    it('should handle single entry', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-01', moodScore: 3, moodLabel: 'okay', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
      ];
      expect(getMoodExtremes(entries)).toEqual({ highest: 3, lowest: 3 });
    });
  });

  describe('calculateStreak', () => {
    it('should return 0 for empty array', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('should calculate streak for consecutive days', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const entries: MoodEntry[] = [
        {
          id: '1',
          date: today.toISOString().split('T')[0],
          moodScore: 5,
          moodLabel: 'great',
          createdAt: today.toISOString(),
          updatedAt: today.toISOString()
        },
        {
          id: '2',
          date: yesterday.toISOString().split('T')[0],
          moodScore: 4,
          moodLabel: 'good',
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString()
        },
        {
          id: '3',
          date: twoDaysAgo.toISOString().split('T')[0],
          moodScore: 3,
          moodLabel: 'okay',
          createdAt: twoDaysAgo.toISOString(),
          updatedAt: twoDaysAgo.toISOString()
        },
      ];
      expect(calculateStreak(entries)).toBe(3);
    });

    it('should return 0 for non-consecutive days', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-01', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: '2', date: '2025-01-05', moodScore: 4, moodLabel: 'good', createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-05T00:00:00Z' },
      ];
      expect(calculateStreak(entries)).toBe(0);
    });
  });

  describe('getWeeklyData', () => {
    it('should return 7 days of data', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-06', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-06T00:00:00Z', updatedAt: '2025-01-06T00:00:00Z' },
      ];
      const targetDate = new Date('2025-01-06');
      const weeklyData = getWeeklyData(entries, targetDate);

      expect(weeklyData).toHaveLength(7);
      expect(weeklyData.every(day => day.date && day.dayLabel)).toBe(true);
    });

    it('should match entries to correct days', () => {
      const entries: MoodEntry[] = [
        { id: '1', date: '2025-01-06', moodScore: 5, moodLabel: 'great', createdAt: '2025-01-06T00:00:00Z', updatedAt: '2025-01-06T00:00:00Z' },
      ];
      const targetDate = new Date('2025-01-06');
      const weeklyData = getWeeklyData(entries, targetDate);

      const matchedDay = weeklyData.find(day => day.date === '2025-01-06');
      expect(matchedDay?.moodScore).toBe(5);
      expect(matchedDay?.entry).toBeDefined();
    });

    it('should return null for days without entries', () => {
      const entries: MoodEntry[] = [];
      const targetDate = new Date('2025-01-06');
      const weeklyData = getWeeklyData(entries, targetDate);

      expect(weeklyData.every(day => day.moodScore === null)).toBe(true);
      expect(weeklyData.every(day => day.entry === undefined)).toBe(true);
    });
  });
});
