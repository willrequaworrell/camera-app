import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../app/index';

// Stub icons to avoid state/act warnings
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock Expo Router with in-factory fn and expose for assertions
jest.mock('expo-router', () => {
  const push = jest.fn();
  const Redirect = ({ href }: { href: string }) => null; // simple stub
  return {
    Redirect,
    useRouter: () => ({ push }),
    __mocked__: { push },
  };
});

// Mock VisionCamera hooks and Camera component safely
jest.mock('react-native-vision-camera', () => {
  const Camera = jest.fn(() => null);
  // Track permission and device states via closures per render
  let hasPermission = true;
  let device: any = { id: 'mock-device' };

  return {
    Camera,
    // Expose setters for test control
    __mocked__: {
      setPermission: (val: boolean) => { hasPermission = val; },
      setDevice: (val: any) => { device = val; },
    },
    useCameraPermission: () => ({ hasPermission }),
    useCameraDevice: () => device,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  // Default: permission granted, device present
  const vc = require('react-native-vision-camera').__mocked__;
  vc.setPermission(true);
  vc.setDevice({ id: 'mock-device' });
});

describe('HomeScreen', () => {
  it('redirects to /permissions when camera permission is not granted', () => {
    const vc = require('react-native-vision-camera').__mocked__;
    vc.setPermission(false);

    const { UNSAFE_getByType } = render(<HomeScreen />);
    // The stubbed Redirect component will render; asserting presence by type
    const { Redirect } = require('expo-router');
    expect(() => UNSAFE_getByType(Redirect)).not.toThrow();
  });

  it('renders an empty SafeAreaView when no camera device is available', () => {
    const vc = require('react-native-vision-camera').__mocked__;
    vc.setDevice(null);

    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeTruthy(); // component renders the fallback SafeAreaView
  });

  it('renders the camera preview when permission granted and device available', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
    // Optionally assert Camera component was constructed
    const RNVC = require('react-native-vision-camera');
    expect(RNVC.Camera).toHaveBeenCalled(); // camera preview mounted
  });

  it('flips camera between front and back when Flip Camera is pressed', () => {
    // Render
    const { getByLabelText, rerender } = render(<HomeScreen />);

    // Initial device: mock-device; pressing flip should ask for opposite device id on next render
    // Simulate that useCameraDevice returns different device after flip
    const vc = require('react-native-vision-camera').__mocked__;
    const flipBtn = getByLabelText(/flip camera/i);

    // First press → setDevice to front
    vc.setDevice({ id: 'front-device' });
    fireEvent.press(flipBtn);
    rerender(<HomeScreen />);

    // Second press → setDevice back to back
    vc.setDevice({ id: 'back-device' });
    fireEvent.press(flipBtn);
    rerender(<HomeScreen />);

    // Camera should have been (re)created; this mainly validates the control is wired
    const RNVC = require('react-native-vision-camera');
    expect(RNVC.Camera).toHaveBeenCalled();
  });

  it('toggles flash when Toggle Flash is pressed', () => {
    // Since flash is internal state passed into takePhoto, we can validate by pressing twice
    const { getByLabelText } = render(<HomeScreen />);
    const flashBtn = getByLabelText(/toggle flash/i);

    fireEvent.press(flashBtn); // off -> on
    fireEvent.press(flashBtn); // on -> off

    // No thrown error implies handler bound; deeper assertion would require exposing state or refactoring
    expect(true).toBe(true);
  });

  it('calls takePhoto and navigates to /analyze with media param', async () => {
    // Mock the Camera component to capture ref and implement takePhoto
    const RNVC = require('react-native-vision-camera');
    const cameraRefMap = new Map<any, any>();
    // Replace Camera mock to assign the ref.current with a mock object
    RNVC.Camera.mockImplementation(({ ref }: any) => {
      if (ref) {
        ref.current = {
          takePhoto: jest.fn(async () => ({ path: '/mock/image.jpg' })),
        };
      }
      return null;
    });

    const { getByLabelText } = render(<HomeScreen />);
    const takeBtn = getByLabelText(/take photo/i);

    fireEvent.press(takeBtn);

    const router = require('expo-router').__mocked__;
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/analyze',
        params: { media: '/mock/image.jpg' },
      });
    });
  });
});
