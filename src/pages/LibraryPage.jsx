import React from 'react';

const LibraryPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-bold mb-6">资料库</h1>
      <div className="p-12 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-text-muted">
        <p>您的收藏是空的</p>
      </div>
    </div>
  );
};

export default LibraryPage;
