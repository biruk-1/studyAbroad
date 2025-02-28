import React from 'react';

interface WithClassNameProps {
  className?: string;
}

const withClassName = <P extends object>(Component: React.ComponentType<P>) => {
  return ({ className, ...props }: WithClassNameProps & P) => (
    <div className={className}>
      <Component {...(props as P)} />
    </div>
  );
};

export default withClassName;