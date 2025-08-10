"use client";

import * as React from 'react';
import { suggestItems } from '@/ai/flows/suggest-items';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from 'lucide-react';

interface AiSuggestionsProps {
  cartItems: string[];
}

export function AiSuggestions({ cartItems }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (cartItems.length > 0) {
      setLoading(true);
      suggestItems({ cartItems })
        .then(response => {
          setSuggestions(response.suggestedItems);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [cartItems]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-3">
          <Sparkles className="text-accent" />
          Rekomendasi AI
        </CardTitle>
        <CardDescription>
          Saran produk berdasarkan isi keranjang Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
           <p className="text-sm text-muted-foreground">Tambahkan barang ke keranjang untuk melihat rekomendasi.</p>
        ) : loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item, index) => (
              <Badge key={index} variant="outline" className="text-base bg-accent/10 border-accent/50 text-accent-foreground py-1 px-3">
                {item}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
