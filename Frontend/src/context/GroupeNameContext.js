/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react';

const GroupNameContext = createContext();

export const useGroupName = () => {
  return useContext(GroupNameContext);
};

export const GroupNameProvider = ({ children }) => {
  const [groupNameC, setGroupNameC] = useState('');

  return (
    <GroupNameContext.Provider value={{ groupNameC, setGroupNameC }}>
      {children}
    </GroupNameContext.Provider>
  );
};
