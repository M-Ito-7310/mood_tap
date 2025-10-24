import { describe, it, expect } from 'vitest';
import { MAX_NOTE_LENGTH, APP_NAME, APP_DESCRIPTION } from '../constants';

describe('Constants', () => {
  it('should have correct MAX_NOTE_LENGTH', () => {
    expect(MAX_NOTE_LENGTH).toBe(100);
    expect(typeof MAX_NOTE_LENGTH).toBe('number');
  });

  it('should have correct APP_NAME', () => {
    expect(APP_NAME).toBe('MoodTap');
    expect(typeof APP_NAME).toBe('string');
  });

  it('should have correct APP_DESCRIPTION', () => {
    expect(APP_DESCRIPTION).toBe('シンプルな気分記録PWA');
    expect(typeof APP_DESCRIPTION).toBe('string');
  });
});
