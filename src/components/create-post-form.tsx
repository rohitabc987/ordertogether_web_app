'use client';

import { useActionState, useState, useTransition } from 'react';
import { createPostAction, getRestaurantSuggestions } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Lightbulb } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  restaurant: z.string().min(1, 'Restaurant is required.'),
  minAmount: z.coerce.number().min(0, 'Amount must be positive.'),
  maxAmount: z.coerce.number().min(0, 'Amount must be positive.'),
  deadline: z.date({ required_error: 'A deadline is required.' }),
  notes: z.string().optional(),
}).refine(data => data.minAmount <= data.maxAmount, {
  message: "Minimum amount cannot be greater than maximum amount.",
  path: ["minAmount"],
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePostForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(createPostAction, null);
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurant: '',
      minAmount: 200,
      maxAmount: 500,
      notes: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    startSubmitTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      formData.append('authorId', user.id);
      formData.append('authorName', user.name);
      formData.append('contact', JSON.stringify(user.contact));
      formData.append('location', JSON.stringify(user.location));
      
      formAction(formData);
    });
  };
  
  const handleGetSuggestions = async () => {
    startSuggestionTransition(async () => {
      const result = await getRestaurantSuggestions(user.location.society);
      setSuggestions(result);
    });
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create a New Order Post</CardTitle>
        <CardDescription>Let others in your building know you're ordering.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="restaurant">Delivery App / Restaurant</Label>
            <div className="flex items-center gap-2">
                <Controller
                  name="restaurant"
                  control={form.control}
                  render={({ field }) => (
                    <Input id="restaurant" {...field} placeholder="e.g. Zomato, Truffles" />
                  )}
                />
              <Button type="button" variant="outline" onClick={handleGetSuggestions} disabled={isSuggesting}>
                <Lightbulb className="mr-2 h-4 w-4" /> {isSuggesting ? 'Getting...' : 'Suggest'}
              </Button>
            </div>
            {suggestions.length > 0 && (
                <Controller
                  name="restaurant"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Or pick a suggestion..."/>
                        </SelectTrigger>
                        <SelectContent>
                            {suggestions.map((s, i) => (
                                <SelectItem key={i} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  )}
                />
            )}
            {form.formState.errors.restaurant && <p className="text-sm text-destructive">{form.formState.errors.restaurant.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Order Amount (₹)</Label>
               <Controller
                name="minAmount"
                control={form.control}
                render={({ field }) => (
                  <Input id="minAmount" type="number" {...field} />
                )}
              />
              {form.formState.errors.minAmount && <p className="text-sm text-destructive">{form.formState.errors.minAmount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Maximum Order Amount (₹)</Label>
               <Controller
                name="maxAmount"
                control={form.control}
                render={({ field }) => (
                  <Input id="maxAmount" type="number" {...field} />
                )}
              />
              {form.formState.errors.maxAmount && <p className="text-sm text-destructive">{form.formState.errors.maxAmount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Controller
              name="deadline"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.deadline && <p className="text-sm text-destructive">{form.formState.errors.deadline.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Textarea id="notes" placeholder="e.g. Only vegetarian options" {...field} />
              )}
            />
          </div>
          
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
