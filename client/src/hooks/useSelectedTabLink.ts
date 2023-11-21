import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSelectedTabLink(sortedLinks: (string | string[])[]) {
  const location = useLocation();

  const tabIndex = useMemo(
    () =>
      sortedLinks.findIndex((link) => {
        if (Array.isArray(link)) {
          return link.some((url) => url === location.pathname);
        }

        return link === location.pathname;
      }),
    [sortedLinks, location.pathname],
  );

  return { tabIndex };
}
