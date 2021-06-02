import React from 'react';

export default function PageContainer(page) {
  const { children } = page;
  return (
    <div className="container">
      { children }
    </div>
  );
}
