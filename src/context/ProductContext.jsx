import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, writeBatch, query, orderBy, getDocs } from 'firebase/firestore';
import { allProducts as initialProducts } from '../data/products';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('rank', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addProduct = async (product) => {
    const maxRank = products.length > 0 ? Math.max(...products.map(p => p.rank || 0)) : 0;
    await addDoc(collection(db, 'products'), { ...product, rank: maxRank + 1 });
  };

  const updateProduct = async (id, updatedData) => {
    await updateDoc(doc(db, 'products', id), updatedData);
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const updateRanksInFirestore = async (newOrderedProducts) => {
    const batch = writeBatch(db);
    newOrderedProducts.forEach((prod, index) => {
      batch.update(doc(db, 'products', prod.id), { rank: index });
    });
    await batch.commit();
  };

  const moveProductUp = (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index > 0) {
      const newProducts = [...products];
      [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
      setProducts(newProducts); // Optimistic UI update
      updateRanksInFirestore(newProducts);
    }
  };

  const moveProductDown = (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index >= 0 && index < products.length - 1) {
      const newProducts = [...products];
      [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
      setProducts(newProducts); // Optimistic UI update
      updateRanksInFirestore(newProducts);
    }
  };

  const moveProductToPosition = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const newProducts = [...products];
    const [movedItem] = newProducts.splice(fromIndex, 1);
    newProducts.splice(toIndex, 0, movedItem);
    setProducts(newProducts); // Optimistic UI update
    updateRanksInFirestore(newProducts);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, moveProductUp, moveProductDown, moveProductToPosition }}>
      {!loading && children}
    </ProductContext.Provider>
  );
};
