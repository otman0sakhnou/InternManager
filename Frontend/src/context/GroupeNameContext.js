/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';

const GroupNameContext = createContext();

export const useGroupName = () => {
  return useContext(GroupNameContext);
};

export const GroupNameProvider = ({ children }) => {
  const [groupNameC, setGroupNameC] = useState('');
  useEffect(() => {
    const storedGroupName = localStorage.getItem('groupName');
    if (storedGroupName) {
      setGroupNameC(storedGroupName);
    }
  }, []);

  useEffect(() => {
    if (groupNameC) {
      localStorage.setItem('groupName', groupNameC);
    } else {
      localStorage.removeItem('groupName');
    }
  }, [groupNameC]);

  return (
    <GroupNameContext.Provider value={{ groupNameC, setGroupNameC }}>
      {children}
    </GroupNameContext.Provider>
  );
};
