export const getShippingZone = (pincode) => {
  if (!pincode || pincode.length !== 6) return 'default';
  
  const prefix = parseInt(pincode.substring(0, 2), 10);

  // Local / Regional (MH, GJ, MP, Goa, CG)
  if ((prefix >= 36 && prefix <= 49)) {
    return 'local';
  }
  
  // Metros (Delhi, BLR, CHN, HYD)
  if (prefix === 11 || (prefix >= 56 && prefix <= 59) || (prefix >= 60 && prefix <= 64) || (prefix >= 50 && prefix <= 53)) {
    return 'metros';
  }
  
  // East (WB, OR, BR, JH)
  if (prefix >= 70 && prefix <= 77 || prefix >= 80 && prefix <= 85) return 'east';
  
  // North (UP, UK, PB, HR, RJ)
  if (prefix >= 20 && prefix <= 34 || prefix >= 12 && prefix <= 16) return 'north';
  
  // South (KL, AP)
  if (prefix >= 67 && prefix <= 69) return 'south';

  // Far North (J&K, HP)
  if (prefix >= 17 && prefix <= 19) return 'farnorth';
  
  // North East
  if (prefix >= 78 && prefix <= 79) return 'northeast';

  return 'default';
};

export const calculateShippingCost = (pincode, shippingRates) => {
  if (!shippingRates) return 1500; // Hard fallback
  const zone = getShippingZone(pincode);
  return shippingRates[zone]?.rate || shippingRates['default']?.rate || 1500;
};
