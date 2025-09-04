// tests/permissions.test.tsx
import '@testing-library/jest-native/extend-expect'; // Add this import
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import PermissionsScreen from '../app/permissions';

// Stub icons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

// Mock router (define inside factory)
jest.mock('expo-router', () => {
  const replace = jest.fn();
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ replace }),
    __mocked__: { replace },
  };
});

// Mock camera (define inside factory)
jest.mock('react-native-vision-camera', () => {
  const requestCameraPermission = jest.fn();
  return {
    Camera: { requestCameraPermission },
    __mocked__: { requestCameraPermission },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PermissionsScreen', () => {
  it('does not navigate when Continue is pressed while permission is not granted', () => {
    const { getByLabelText } = render(<PermissionsScreen />);
    const continueBtn = getByLabelText(/continue/i);
    fireEvent.press(continueBtn);
    const { __mocked__ } = require('expo-router');
    expect(__mocked__.replace).not.toHaveBeenCalled();
  });

  it('navigates after granting permission then pressing Continue', async () => {
    const camera = require('react-native-vision-camera').__mocked__;
    camera.requestCameraPermission.mockResolvedValueOnce('granted');

    const { getByRole, getByLabelText } = render(<PermissionsScreen />);

    // Initially, Continue should be disabled
    const continueBtn = getByLabelText(/continue/i);
    expect(continueBtn).toBeDisabled();

    // Toggle the switch
    const cameraSwitch = getByRole('switch', { name: /allow camera/i });
    await act(async () => {
      fireEvent(cameraSwitch, 'valueChange', true);
      // Wait for the async permission request to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Wait for Continue to become enabled
    await waitFor(() => {
      expect(getByLabelText(/continue/i)).toBeEnabled();
    }, { timeout: 3000 });

    // Press Continue
    fireEvent.press(continueBtn);

    // Assert navigation
    const router = require('expo-router').__mocked__;
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'));
  });
});
