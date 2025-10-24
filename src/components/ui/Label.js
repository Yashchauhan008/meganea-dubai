import React from 'react';

const Label = ({ children, ...props }) => {
  return (
    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1" {...props}>
      {children}
    </label>
  );
};

export default Label;
