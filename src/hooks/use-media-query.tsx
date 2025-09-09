import { useMediaQuery as useOriginalMediaQuery } from 'usehooks-ts';

export function useMediaQuery(query: string) {
  const matches = useOriginalMediaQuery(query);
  return matches;
}
