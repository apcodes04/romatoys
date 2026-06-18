import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!isAdmin) {
      setLeads([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'leads'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Lead fetch error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  const addLead = async (leadData) => {
    await addDoc(collection(db, 'leads'), {
      ...leadData,
      date: new Date().toISOString()
    });
  };

  const deleteLead = async (id) => {
    await deleteDoc(doc(db, 'leads', id));
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, deleteLead }}>
      {!loading && children}
    </LeadContext.Provider>
  );
};
