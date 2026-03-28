import { Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Responsive Width
 * Scale based on screen width
 */
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
};

/**
 * Responsive Height
 * Scale based on screen height
 */
export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
};

/**
 * Responsive Font Size
 * Scales font sizes based on screen width
 */
export const RFValue = (fontSize, standardScreenHeight = guidelineBaseHeight) => {
  const heightPercent = (fontSize * SCREEN_HEIGHT) / standardScreenHeight;
  return Math.round(heightPercent);
};

// Export size-matters functions
export const s = scale;           // Horizontal scaling
export const vs = verticalScale;  // Vertical scaling
export const ms = moderateScale;  // Moderate scaling (with factor)

// Screen dimensions
export const WINDOW_WIDTH = SCREEN_WIDTH;
export const WINDOW_HEIGHT = SCREEN_HEIGHT;

// Responsive breakpoints
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
export const isLargeDevice = SCREEN_WIDTH >= 768;

/**
 * Get responsive size based on device
 */
export const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

/**
 * Normalize size based on screen dimensions
 */
export const normalize = (size) => {
  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  const newSize = size * scale;
  return Math.round(newSize);
};

/**
 * Normalize vertical size
 */
export const normalizeVertical = (size) => {
  const scale = SCREEN_HEIGHT / guidelineBaseHeight;
  const newSize = size * scale;
  return Math.round(newSize);
};

