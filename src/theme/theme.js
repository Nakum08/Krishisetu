export const theme = {
     colors: {
      primary: '#4CAF50',      // Main green color for primary actions
      primaryDark: '#388E3C',  // Darker shade of primary
      primaryLight: '#C8E6C9', // Lighter shade of primary
      secondary: '#FFA000',    // Amber color for secondary elements
      tertiary: '#5C6BC0',     // Indigo for tertiary elements
      
      background: '#F5F5F5',   // Light gray background
      surface: '#FFFFFF',      // White surface
      
      textPrimary: '#212121',  // Almost black for primary text
      textSecondary: '#757575', // Medium gray for secondary text
      textLight: '#FFFFFF',    // White text for dark backgrounds
      
      error: '#D32F2F',        // Red for errors
      success: '#388E3C',      // Green for success messages
      warning: '#FFA000',      // Amber for warnings
      info: '#1976D2',         // Blue for info messages
      
      border: '#E0E0E0',       // Light gray for borders
      inactive: '#9E9E9E',     // Medium gray for inactive elements
      divider: '#EEEEEE',      // Very light gray for dividers
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    borderRadius: {
      xs: 2,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      round: 999, // For circular elements
    },
    
    typography: {
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      fontWeights: {
        light: '300',
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
      },
    },
    
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1,
        elevation: 1,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    },
    
    // Common component-specific styles
    form: {
      inputHeight: 48,
      labelMarginBottom: 8,
    },
    
    // Animation durations
    animation: {
      fast: 200,
      normal: 300,
      slow: 500,
    },

    
  };
  
  export default theme;