
'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Combobox } from './ui/combobox';
import { institutions } from '@/lib/institutions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface PostFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  amountFilter: number[];
  setAmountFilter: (value: number[]) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  restaurantFilter: string;
  setRestaurantFilter: (value: string) => void;
  institutionFilter: string;
  setInstitutionFilter: (value: string) => void;
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
  genderFilter,
  setGenderFilter,
  restaurantFilter,
  setRestaurantFilter,
  institutionFilter,
  setInstitutionFilter,
}: PostFiltersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });

  const animateClass = isInView
    ? 'scale-100 opacity-100'
    : 'scale-0 opacity-0';

  return (
    <div 
      ref={ref}
      className={cn(
        "sticky top-20 transition-all duration-500 ease-out transform-gpu origin-center",
        animateClass
    )}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* for deadline  */}
          <div className="space-y-2">
              <Label>Deadline</Label>
              <div className="flex flex-wrap gap-2">
                  {timeOptions.map(option => (
                      <Button
                          key={option.value}
                          size="sm"
                          variant={timeFilter === option.value ? 'default' : 'outline'}
                          onClick={() => setTimeFilter(option.value)}
                          className="flex-grow"
                      >
                          {option.label}
                      </Button>
                  ))}
              </div>
          </div>
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                  <Label>Amount Needed</Label>
                  <div className="text-sm font-medium text-muted-foreground">
                      {formatCurrency(amountFilter[0])} - {amountFilter[1] >= 10000 ? 'Any' : formatCurrency(amountFilter[1])}
                  </div>
              </div>
              <Slider
                  value={amountFilter}
                  onValueChange={setAmountFilter}
                  min={0}
                  max={10000}
                  step={50}
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Poster's Gender</Label>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Gender</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant">App/Restaurant Name</Label>
            <Input 
              id="restaurant"
              placeholder="e.g. Zomato, Swiggy..."
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Combobox
                options={institutions}
                value={institutionFilter}
                onChange={setInstitutionFilter}
                placeholder="Select institution..."
                searchPlaceholder="Search institution..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
