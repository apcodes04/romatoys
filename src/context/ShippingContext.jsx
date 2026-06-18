import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export const ShippingContext = createContext();

export const ShippingProvider = ({ children }) => {
  const [shippingRates, setShippingRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'shipping');
    
    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (snapshot.exists()) {
        setShippingRates(snapshot.data());
        setLoading(false);
      } else {
        // Seed default rates if they don't exist
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
          await setDoc(docRef, defaultRates);
          setShippingRates(defaultRates);
        } catch (error) {
          console.error("Error creating default shipping rates", error);
          setShippingRates(defaultRates); // Fallback so UI works
        }
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase fetch error:", error);
      // Provide default rates so the Admin UI doesn't crash on permission denied
      const fallbackRates = {
        local: { name: 'Local (MH/Goa/GJ)', rate: 750 },
        metros: { name: 'Major Metros', rate: 1100 },
        north: { name: 'North India', rate: 1400 },
        south: { name: 'South India', rate: 1200 },
        east: { name: 'East India', rate: 1400 },
        farnorth: { name: 'Far North (J&K, HP)', rate: 2500 },
        northeast: { name: 'North East India', rate: 3000 },
        default: { name: 'Default/Other', rate: 1500 }
      };
      setShippingRates(fallbackRates);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateRates = async (newRates) => {
    const docRef = doc(db, 'settings', 'shipping');
    await updateDoc(docRef, newRates);
  };

  return (
    <ShippingContext.Provider value={{ shippingRates, updateRates }}>
      {!loading && children}
    </ShippingContext.Provider>
  );
};
