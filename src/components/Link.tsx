import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

/**
 * Universal Next.js compatible Link component that integrates with React Router.
 * Supports standard Next.js `href` property and provides seamless single-page navigation.
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow standard browser behavior for external links, new tabs, or modifier keys
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      props.target === '_blank'
    ) {
      return;
    }

    e.preventDefault();
    if (location.pathname !== href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(href);
    }
  };

  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={href} onClick={handleClick} className={combinedClassName} {...props}>
      {children}
    </a>
  );
};

export default Link;
