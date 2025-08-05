import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { useEffect, useState } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector<RootState, TSelected>(selector);


export const useDebounced = ({ searchQuery, delay }: { searchQuery: string; delay: number }) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchQuery);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, delay]);

    return debouncedValue;
}
