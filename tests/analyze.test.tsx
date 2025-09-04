// tests/analyze.test.tsx
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import AnalyzeScreen from '../app/analyze';

// Mock icons to avoid act warnings
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock expo-router
jest.mock('expo-router', () => {
  const back = jest.fn();
  const useLocalSearchParams = jest.fn(() => ({ media: '/mock/path/photo.jpg' }));
  return {
    useRouter: () => ({ back }),
    useLocalSearchParams,
    __mocked__: { back },
  };
});

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();
process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'mock-api-key';

beforeEach(() => {
  jest.clearAllMocks();
  
  // Default successful mocks
  const fs = require('expo-file-system');
  fs.readAsStringAsync.mockResolvedValue('mock-base64-string');
  
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      candidates: [{
        content: {
          parts: [{ text: 'A beautiful sunset over mountains with golden light.' }]
        }
      }]
    }),
  });
});

describe('AnalyzeScreen', () => {
  it('shows loading state initially when media is provided', () => {
    const { getByLabelText, queryByText } = render(<AnalyzeScreen />);
    
    expect(getByLabelText('Loading analysis')).toBeTruthy();
    expect(queryByText('AI Analysis:')).toBeFalsy();
  });

  it('displays analysis result after successful API call', async () => {
    const { getByText, queryByLabelText } = render(<AnalyzeScreen />);

    await waitFor(() => {
      expect(getByText('AI Analysis:')).toBeTruthy();
    });

    expect(getByText('A beautiful sunset over mountains with golden light.')).toBeTruthy();
    expect(queryByLabelText('Loading analysis')).toBeFalsy();
  });

  it('calls file system and API with correct parameters', async () => {
    render(<AnalyzeScreen />);

    await waitFor(() => {
      expect(require('expo-file-system').readAsStringAsync).toHaveBeenCalledWith(
        'file:///mock/path/photo.jpg',
        { encoding: 'base64' }
      );
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': 'mock-api-key',
          },
        })
      );
    });
  });

  it('handles API error gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { queryByText } = render(<AnalyzeScreen />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(queryByText('AI Analysis:')).toBeFalsy();
    consoleSpy.mockRestore();
  });

  it('does not call API when no media param is provided', () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockImplementationOnce(() => ({}));
    
    render(<AnalyzeScreen />);

    expect(require('expo-file-system').readAsStringAsync).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('enables Back to Camera button only after analysis completes', async () => {
    const { getByLabelText } = render(<AnalyzeScreen />);

    const backButton = getByLabelText(/back to camera/i);
    expect(backButton.props.accessibilityState?.disabled).toBe(true);

    await waitFor(() => {
      expect(getByLabelText(/back to camera/i).props.accessibilityState?.disabled).toBe(false);
    });
  });

  it('navigates back when Back to Camera is pressed after analysis', async () => {
    const { getByLabelText } = render(<AnalyzeScreen />);

    await waitFor(() => {
      const backButton = getByLabelText(/back to camera/i);
      expect(backButton.props.accessibilityState?.disabled).toBe(false);
    });

    const backButton = getByLabelText(/back to camera/i);
    fireEvent.press(backButton);

    const { __mocked__ } = require('expo-router');
    expect(__mocked__.back).toHaveBeenCalled();
  });

  it('displays the captured image', () => {
    const { getByLabelText } = render(<AnalyzeScreen />);
    
    const image = getByLabelText('Captured photo');
    expect(image.props.source.uri).toBe('file:///mock/path/photo.jpg');
  });
});
