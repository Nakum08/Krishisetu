const theme = {
  colors: {
    primary: "#2E7D32",       // Dark Green - Main accent color
    secondary: "#C8E6C9",     // Light Green - For backgrounds and highlights
    accent: "#FFC107",        // Amber - For call-to-action buttons or accents
    textPrimary: "#212121",   // Almost Black - Main text color
    textSecondary: "#757575", // Grey - Secondary text and descriptions
    error: "#D32F2F",         // Red - For error messages
    background: "#FFFFFF",    // White - Primary background for screens and forms
    surface: "#FAFAFA",       // Light Grey - For cards and elevated surfaces
  },
  fonts: {
    regular: "Roboto-Regular",
    medium: "Roboto-Medium",
    bold: "Roboto-Bold",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    // Predefined border radius sizes
    sm: 4,
    md: 8,
    lg: 16,
  },
  shadows: {
    // Shadow styles for cross-platform elevation (iOS and Android)
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    heavy: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  // Optional breakpoints for responsive design
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
};

export default theme;
