import React, { useContext } from 'react';
import AppContext from '../../lib/app-context';

export default function PageContainer({ children }) {
  const { bgColor } = useContext(AppContext);
  return (
    <div className={`container ${bgColor}`}>
      {children}
    </div>
  );
}
