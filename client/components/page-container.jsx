import React from 'react';

export default function PageContainer(page) {
  // console.log('page', page)
  const { children } = page;
  return (
    <div className="container">
      { children }
    </div>
  );
}
