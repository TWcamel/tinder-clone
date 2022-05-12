import React, { useContext } from 'react';

const MachesContext = React.createContext(null);

export const useMaches = () => useContext(MachesContext);
