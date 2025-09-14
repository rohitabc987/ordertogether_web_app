'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { Filter } from 'lucide-react';

interface PostFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  amountFilter: number[];
  setAmountFilter: (value: number[]) => void;
}

export function PostFilters({
  timeFilter,
  setTimeFilter,
  amountFilter,
  setAmountFilter,
}: PostFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold font-headline">Filters</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-filter">Deadline Within</Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger id="time-filter">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="1">Next hour</SelectItem>
                <SelectItem value="3">Next 3 hours</SelectItem>
                <SelectItem value="6">Next 6 hours</SelectItem>
                <SelectItem value="24">Next 24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount Range</Label>
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(amountFilter[0])}</span>
                <span>{formatCurrency(amountFilter[1])}</span>
            </div>
            <Slider
              value={amountFilter}
              onValueChange={setAmountFilter}
              min={0}
              max={2000}
              step={50}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
