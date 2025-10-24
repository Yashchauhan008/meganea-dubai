import React from 'react';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

export default Select;
