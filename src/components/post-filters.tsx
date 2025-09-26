'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';

interface PostFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  amountFilter: number[];
  setAmountFilter: (value: number[]) => void;
}

const timeOptions = [
    { value: 'all', label: 'Any time' },
    { value: '1', label: 'Next hour' },
    { value: '3', label: 'Next 3 hours' },
    { value: '6', label: 'Next 6 hours' },
    { value: '24', label: 'Next 24 hours' },
];


export function PostFilters({
  timeFilter,
  setTimeFilter,
  amountFilter,
  setAmountFilter,
}: PostFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex items-center gap-2 text-lg font-semibold font-headline text-primary self-start">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full">
            <div className="flex items-center gap-3 flex-wrap">
                <Label className="text-base">Deadline:</Label>
                {timeOptions.map(option => (
                    <Button
                        key={option.value}
                        variant={timeFilter === option.value ? 'default' : 'outline'}
                        onClick={() => setTimeFilter(option.value)}
                        className="transition-transform duration-300 hover:scale-105"
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
                <div className="flex justify-between items-center">
                    <Label className="text-base">Amount:</Label>
                    <div className="text-sm font-medium bg-brand-gradient text-transparent bg-clip-text">
                        {formatCurrency(amountFilter[0])} - {formatCurrency(amountFilter[1])}
                    </div>
                </div>
                <Slider
                    value={amountFilter}
                    onValueChange={setAmountFilter}
                    min={0}
                    max={10000}
                    step={50}
                    className="[&>span:first-child]:h-1 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-teal-400 [&>span:first-child]:to-purple-500"
                />
            </div>
        </div>
    </div>
  );
}
