import { useTranslation } from 'react-i18next';

/**
 * Translation service for database content
 * Handles translation of product names, categories, and other dynamic content
 */

// Product name translations mapping
export const productTranslations = {
  // Vegetables
  'Fresh Tomatoes': {
    gu: 'તાજા ટામેટા',
    hi: 'ताजे टमाटर'
  },
  'Sweet Corn': {
    gu: 'મીઠા મકાઈ',
    hi: 'मीठी मक्का'
  },
  'Green Bell Peppers': {
    gu: 'લીલા શિમલા મરચાં',
    hi: 'हरी शिमला मिर्च'
  },
  'Fresh Carrots': {
    gu: 'તાજા ગાજર',
    hi: 'ताजी गाजर'
  },
  'Crispy Lettuce': {
    gu: 'ક્રિસ્પી લેટ્યુસ',
    hi: 'कुरकुरे लेट्यूस'
  },
  'Fresh Spinach': {
    gu: 'તાજા પાલક',
    hi: 'ताजा पालक'
  },
  'Red Onions': {
    gu: 'લાલ ડુંગળી',
    hi: 'लाल प्याज'
  },
  'Fresh Cucumbers': {
    gu: 'તાજા કાકડી',
    hi: 'ताजे खीरे'
  },
  'Green Beans': {
    gu: 'લીલા બીન્સ',
    hi: 'हरी फलियां'
  },
  'Fresh Broccoli': {
    gu: 'તાજા બ્રોકોલી',
    hi: 'ताजा ब्रोकली'
  },
  'Purple Eggplant': {
    gu: 'જાંબલી રીંગણ',
    hi: 'बैंगनी बैंगन'
  },
  'Fresh Cauliflower': {
    gu: 'તાજા ફૂલગોભી',
    hi: 'ताजा फूलगोभी'
  },
  'Red Radishes': {
    gu: 'લાલ મૂળા',
    hi: 'लाल मूली'
  },
  'Fresh Zucchini': {
    gu: 'તાજા ઝુકિની',
    hi: 'ताजी जुकीनी'
  },
  'Green Peas': {
    gu: 'લીલા વટાણા',
    hi: 'हरे मटर'
  },
  'Fresh Asparagus': {
    gu: 'તાજા એસ્પેરાગસ',
    hi: 'ताजा शतावरी'
  },
  'White Mushrooms': {
    gu: 'સફેદ મશરૂમ',
    hi: 'सफेद मशरूम'
  },
  'Fresh Kale': {
    gu: 'તાજા કેલ',
    hi: 'ताजा केल'
  },
  'Red Cabbage': {
    gu: 'લાલ ગોભી',
    hi: 'लाल गोभी'
  },
  'Fresh Beets': {
    gu: 'તાજા બીટ',
    hi: 'ताजी चुकंदर'
  },

  // Fruits
  'Fresh Apples': {
    gu: 'તાજા સફરજન',
    hi: 'ताजे सेब'
  },
  'Sweet Bananas': {
    gu: 'મીઠા કેળા',
    hi: 'मीठे केले'
  },
  'Juicy Oranges': {
    gu: 'રસદાર સંતરા',
    hi: 'रसीले संतरे'
  },
  'Fresh Grapes': {
    gu: 'તાજા દ્રાક્ષ',
    hi: 'ताजे अंगूर'
  },
  'Sweet Strawberries': {
    gu: 'મીઠા સ્ટ્રોબેરી',
    hi: 'मीठे स्ट्रॉबेरी'
  },
  'Fresh Mangoes': {
    gu: 'તાજા કેરી',
    hi: 'ताजे आम'
  },
  'Sweet Mangoes': {
    gu: 'મીઠા કેરી',
    hi: 'मीठे आम'
  },
  'Sweet Pineapples': {
    gu: 'મીઠા અનાનસ',
    hi: 'मीठे अनानास'
  },
  'Fresh Pears': {
    gu: 'તાજા નાશપતી',
    hi: 'ताजे नाशपाती'
  },
  'Sweet Peaches': {
    gu: 'મીઠા આડુ',
    hi: 'मीठे आड़ू'
  },
  'Fresh Kiwis': {
    gu: 'તાજા કિવી',
    hi: 'ताजे कीवी'
  },
  'Sweet Watermelons': {
    gu: 'મીઠા તરબૂજ',
    hi: 'मीठे तरबूज'
  },
  'Fresh Papayas': {
    gu: 'તાજા પપૈયા',
    hi: 'ताजे पपीते'
  },
  'Sweet Cherries': {
    gu: 'મીઠા ચેરી',
    hi: 'मीठे चेरी'
  },
  'Fresh Plums': {
    gu: 'તાજા આલુબુખારા',
    hi: 'ताजे आलूबुखारे'
  },
  'Sweet Blueberries': {
    gu: 'મીઠા બ્લુબેરી',
    hi: 'मीठे ब्लूबेरी'
  },
  'Fresh Avocados': {
    gu: 'તાજા એવોકાડો',
    hi: 'ताजे एवोकाडो'
  },
  'Sweet Lemons': {
    gu: 'મીઠા લીંબુ',
    hi: 'मीठे नींबू'
  },
  'Fresh Lime': {
    gu: 'તાજા લીંબુ',
    hi: 'ताजे नींबू'
  },
  'Sweet Pomegranates': {
    gu: 'મીઠા દાડમ',
    hi: 'मीठे अनार'
  },

  // Grains
  'Organic Rice': {
    gu: 'ઓર્ગેનિક ચોખા',
    hi: 'ऑर्गेनिक चावल'
  },
  'Whole Wheat': {
    gu: 'સંપૂર્ણ ઘઉં',
    hi: 'साबुत गेहूं'
  },
  'Fresh Quinoa': {
    gu: 'તાજા કિનોઆ',
    hi: 'ताजा किनोआ'
  },
  'Organic Oats': {
    gu: 'ઓર્ગેનિક ઓટ્સ',
    hi: 'ऑर्गेनिक ओट्स'
  },
  'Brown Rice': {
    gu: 'બ્રાઉન રાઇસ',
    hi: 'ब्राउन राइस'
  },
  'Fresh Barley': {
    gu: 'તાજા જવ',
    hi: 'ताजी जौ'
  },
  'Organic Millet': {
    gu: 'ઓર્ગેનિક બાજરી',
    hi: 'ऑर्गेनिक बाजरा'
  },
  'Fresh Corn': {
    gu: 'તાજા મકાઈ',
    hi: 'ताजी मक्का'
  },
  'Organic Buckwheat': {
    gu: 'ઓર્ગેનિક બકવીટ',
    hi: 'ऑर्गेनिक बकवीट'
  },
  'Fresh Rye': {
    gu: 'તાજા રાય',
    hi: 'ताजी राई'
  },

  // Spices
  'Fresh Turmeric': {
    gu: 'તાજા હળદર',
    hi: 'ताजी हल्दी'
  },
  'Organic Cumin': {
    gu: 'ઓર્ગેનિક જીરું',
    hi: 'ऑर्गेनिक जीरा'
  },
  'Fresh Coriander': {
    gu: 'તાજા ધાણા',
    hi: 'ताजा धनिया'
  },
  'Organic Cardamom': {
    gu: 'ઓર્ગેનિક ઇલાયચી',
    hi: 'ऑर्गेनिक इलायची'
  },
  'Fresh Ginger': {
    gu: 'તાજા આદુ',
    hi: 'ताजा अदरक'
  },
  'Organic Cinnamon': {
    gu: 'ઓર્ગેનિક દાલચીની',
    hi: 'ऑर्गेनिक दालचीनी'
  },
  'Fresh Garlic': {
    gu: 'તાજા લસણ',
    hi: 'ताजा लहसुन'
  },
  'Organic Black Pepper': {
    gu: 'ઓર્ગેનિક કાળા મરી',
    hi: 'ऑर्गेनिक काली मिर्च'
  },
  'Fresh Bay Leaves': {
    gu: 'તાજા તેજપત્તા',
    hi: 'ताजे तेजपत्ते'
  },
  'Organic Cloves': {
    gu: 'ઓર્ગેનિક લવિંગ',
    hi: 'ऑर्गेनिक लौंग'
  },

  // Honey
  'Pure Honey': {
    gu: 'શુદ્ધ મધ',
    hi: 'शुद्ध शहद'
  },
  'Wildflower Honey': {
    gu: 'વાઇલ્ડફ્લાવર મધ',
    hi: 'वाइल्डफ्लावर शहद'
  },
  'Organic Honey': {
    gu: 'ઓર્ગેનિક મધ',
    hi: 'ऑर्गेनिक शहद'
  },
  'Raw Honey': {
    gu: 'કાચા મધ',
    hi: 'कच्चा शहद'
  },
  'Forest Honey': {
    gu: 'વન મધ',
    hi: 'वन शहद'
  }
};

// Farmer name translations
export const farmerNameTranslations = {
  'Vikram Rao': {
    gu: 'વિક્રમ રાવ',
    hi: 'विक्रम राव'
  },
  'Suresh Patel': {
    gu: 'સુરેશ પટેલ',
    hi: 'सुरेश पटेल'
  },
  'Ananya Gupta': {
    gu: 'અનન્યા ગુપ્તા',
    hi: 'अनन्या गुप्ता'
  },
  'Rajesh Kumar': {
    gu: 'રાજેશ કુમાર',
    hi: 'राजेश कुमार'
  },
  'Organic Farmer': {
    gu: 'ઓર્ગેનિક ખેડૂત',
    hi: 'ऑर्गेनिक किसान'
  }
};

// Farm story translations (common phrases)
export const farmStoryTranslations = {
  'Freshly harvested organic': {
    gu: 'તાજા કાપેલા ઓર્ગેનિક',
    hi: 'ताजी कटी हुई ऑर्गेनिक'
  },
  'from our family farm': {
    gu: 'અમારા પારિવારિક ખેતરમાંથી',
    hi: 'हमारे पारिवारिक खेत से'
  },
  'grown with natural fertilizers': {
    gu: 'કુદરતી ખાતર સાથે ઉગાવવામાં આવ્યું',
    hi: 'प्राकृतिक खाद के साथ उगाया गया'
  },
  'Sweet and juicy': {
    gu: 'મીઠા અને રસદાર',
    hi: 'मीठे और रसीले'
  },
  'from our orchard': {
    gu: 'અમારા બગીચામાંથી',
    hi: 'हमारे बगीचे से'
  },
  'organically grown': {
    gu: 'ઓર્ગેનિક રીતે ઉગાવવામાં આવ્યું',
    hi: 'ऑर्गेनिक रूप से उगाया गया'
  },
  'fresh and healthy': {
    gu: 'તાજા અને સ્વસ્થ',
    hi: 'ताजे और स्वस्थ'
  },
  'directly from farm': {
    gu: 'સીધા ખેતરમાંથી',
    hi: 'सीधे खेत से'
  }
};

/**
 * Get translated product name
 * @param {string} productName - Original product name
 * @param {string} language - Language code (en, gu, hi)
 * @returns {string} Translated product name
 */
export const getTranslatedProductName = (productName, language = 'en') => {
  if (language === 'en' || !productTranslations[productName]) {
    return productName;
  }
  
  return productTranslations[productName][language] || productName;
};

/**
 * Get translated farmer name
 * @param {string} farmerName - Original farmer name
 * @param {string} language - Language code (en, gu, hi)
 * @returns {string} Translated farmer name
 */
export const getTranslatedFarmerName = (farmerName, language = 'en') => {
  if (language === 'en' || !farmerNameTranslations[farmerName]) {
    return farmerName;
  }
  
  return farmerNameTranslations[farmerName][language] || farmerName;
};

/**
 * Get translated farm story
 * @param {string} farmStory - Original farm story
 * @param {string} language - Language code (en, gu, hi)
 * @returns {string} Translated farm story
 */
export const getTranslatedFarmStory = (farmStory, language = 'en') => {
  if (language === 'en' || !farmStory) {
    return farmStory;
  }

  let translatedStory = farmStory;
  
  // Replace common phrases
  Object.keys(farmStoryTranslations).forEach(phrase => {
    const translation = farmStoryTranslations[phrase][language];
    if (translation) {
      translatedStory = translatedStory.replace(
        new RegExp(phrase, 'gi'), 
        translation
      );
    }
  });
  
  return translatedStory;
};

/**
 * Get translated category name
 * @param {string} categoryId - Category ID
 * @param {string} language - Language code (en, gu, hi)
 * @returns {string} Translated category name
 */
export const getTranslatedCategoryName = (categoryId, language = 'en') => {
  const categoryTranslations = {
    vegetables: {
      gu: 'શાકભાજી',
      hi: 'सब्जियां'
    },
    fruits: {
      gu: 'ફળો',
      hi: 'फल'
    },
    grains: {
      gu: 'અનાજ',
      hi: 'अनाज'
    },
    spices: {
      gu: 'મસાલા',
      hi: 'मसाले'
    },
    honey: {
      gu: 'મધ',
      hi: 'शहद'
    },
    nuts: {
      gu: 'બદામ',
      hi: 'नट्स'
    },
    legumes: {
      gu: 'દાળ',
      hi: 'दालें'
    }
  };

  if (language === 'en' || !categoryTranslations[categoryId]) {
    return categoryId;
  }
  
  return categoryTranslations[categoryId][language] || categoryId;
};

/**
 * Translate entire product object
 * @param {Object} product - Product object from database
 * @param {string} language - Language code (en, gu, hi)
 * @returns {Object} Product object with translated fields
 */
export const translateProduct = (product, language = 'en') => {
  if (!product || language === 'en') {
    return product;
  }

  return {
    ...product,
    crop: getTranslatedProductName(product.crop, language),
    farmStory: getTranslatedFarmStory(product.farmStory, language),
    category: getTranslatedCategoryName(product.category, language),
    farmerName: getTranslatedFarmerName(product.farmerName, language)
  };
};

/**
 * Translate array of products
 * @param {Array} products - Array of product objects
 * @param {string} language - Language code (en, gu, hi)
 * @returns {Array} Array of translated product objects
 */
export const translateProducts = (products, language = 'en') => {
  if (!products || !Array.isArray(products) || language === 'en') {
    return products;
  }

  return products.map(product => translateProduct(product, language));
};

/**
 * Translate array of categories
 * @param {Array} categories - Array of category objects
 * @param {string} language - Language code (en, gu, hi)
 * @returns {Array} Array of translated category objects
 */
export const translateCategories = (categories, language = 'en') => {
  if (!categories || !Array.isArray(categories) || language === 'en') {
    return categories;
  }

  return categories.map(category => ({
    ...category,
    name: getTranslatedCategoryName(category.id, language)
  }));
};

/**
 * Hook to get current language and translation functions
 * @returns {Object} Translation utilities
 */
export const useTranslationUtils = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return {
    currentLanguage,
    translateProduct: (product) => translateProduct(product, currentLanguage),
    translateProducts: (products) => translateProducts(products, currentLanguage),
    translateCategories: (categories) => translateCategories(categories, currentLanguage),
    getTranslatedProductName: (name) => getTranslatedProductName(name, currentLanguage),
    getTranslatedCategoryName: (categoryId) => getTranslatedCategoryName(categoryId, currentLanguage),
    getTranslatedFarmStory: (story) => getTranslatedFarmStory(story, currentLanguage),
    getTranslatedFarmerName: (name) => getTranslatedFarmerName(name, currentLanguage)
  };
};
