import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [shippingRates, setShippingRates] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Shipping Rates
    const shippingDocRef = doc(db, 'settings', 'shipping');
    const unsubscribeShipping = onSnapshot(shippingDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setShippingRates(snapshot.data());
      } else {
        // Default rates
        const defaultRates = {
          local: { name: 'Local (MH/Goa/GJ)', rate: 750 },
          metros: { name: 'Major Metros', rate: 1100 },
          north: { name: 'North India', rate: 1400 },
          south: { name: 'South India', rate: 1200 },
          east: { name: 'East India', rate: 1400 },
          farnorth: { name: 'Far North (J&K, HP)', rate: 2500 },
          northeast: { name: 'North East India', rate: 3000 },
          default: { name: 'Default/Other', rate: 1500 }
        };
        try {
          await setDoc(shippingDocRef, defaultRates);
          setShippingRates(defaultRates);
        } catch (error) {
          console.error("Error creating default shipping rates", error);
          setShippingRates(defaultRates);
        }
      }
    }, (error) => {
      console.error("Firebase fetch error for shipping:", error);
      // Fallback
      setShippingRates({
        local: { name: 'Local (MH/Goa/GJ)', rate: 750 },
        metros: { name: 'Major Metros', rate: 1100 },
        north: { name: 'North India', rate: 1400 },
        south: { name: 'South India', rate: 1200 },
        east: { name: 'East India', rate: 1400 },
        farnorth: { name: 'Far North (J&K, HP)', rate: 2500 },
        northeast: { name: 'North East India', rate: 3000 },
        default: { name: 'Default/Other', rate: 1500 }
      });
    });

    // 2. Fetch Payment Settings (QR Code)
    const paymentDocRef = doc(db, 'settings', 'payment');
    const unsubscribePayment = onSnapshot(paymentDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setPaymentSettings(snapshot.data());
        setLoading(false);
      } else {
        const defaultPayment = {
          qrCodeUrl: '/images/QRcode payment/1.jpeg?v=2' // Fallback to local image
        };
        try {
          await setDoc(paymentDocRef, defaultPayment);
          setPaymentSettings(defaultPayment);
        } catch (error) {
          console.error("Error creating default payment settings", error);
          setPaymentSettings(defaultPayment);
        }
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase fetch error for payment:", error);
      setPaymentSettings({ qrCodeUrl: '/images/QRcode payment/1.jpeg?v=2' });
      setLoading(false);
    });

    return () => {
      unsubscribeShipping();
      unsubscribePayment();
    };
  }, []);

  const updateShippingRates = async (newRates) => {
    const docRef = doc(db, 'settings', 'shipping');
    await updateDoc(docRef, newRates);
  };

  const updatePaymentSettings = async (newSettings) => {
    const docRef = doc(db, 'settings', 'payment');
    await updateDoc(docRef, newSettings);
  };

  return (
    <SettingsContext.Provider value={{ 
      shippingRates, 
      updateShippingRates,
      paymentSettings,
      updatePaymentSettings
    }}>
      {!loading && children}
    </SettingsContext.Provider>
  );
};
