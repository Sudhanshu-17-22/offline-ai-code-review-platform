'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from './ui/accessible.button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  cta,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="text-5xl mb-4 opacity-50" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>

      {cta && (
        <>
          {cta.href ? (
            <Link href={cta.href}>
              <Button variant="primary" onClick={cta.onClick}>
                {cta.label}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={cta.onClick}>
              {cta.label}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
