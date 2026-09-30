export function Container({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
