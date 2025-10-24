import React from 'react';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary ${className}`}
      {...props}
    />
  );
});

export default Input;
