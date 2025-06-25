import { toast } from 'sonner';

import { Button } from '@shared/ui/button';
import { Toaster } from '@shared/ui/sonner';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export const UIPreviewPage = () => (
  <div className="p-6 space-y-8 bg-background font-sans min-h-screen">
    <section className="space-y-2">
      <h1 className="text-4xl font-bold">Heading 1</h1>
      <h2 className="text-3xl font-semibold">Heading 2</h2>
      <h3 className="text-2xl font-medium">Heading 3</h3>
      <h4 className="text-2xl font-medium">Heading 3</h4>
      <p className="text-base">Font Mukta.</p>
      <p className="text-base text-muted-foreground">Font Mukta.</p>
    </section>

    <section className="space-x-4 flex items-center">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button className="bg-primary-light text-primary-light-foreground p-2 text-center">
        Primary light
      </Button>
      <Badge variant="destructive">Badge 123</Badge>
      <span className="relative flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
      </span>
      <Button onClick={() => toast.success('My  toast')}>
        Give me a toast
      </Button>
    </section>

    <section className="space-y-2">
      <Input placeholder="Type something..." />
    </section>

    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">Card Title</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Example component card shadcn/ui.
        </p>
        <div className="flex items-center gap-3 m-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        <div className="bg-success text-success-foreground p-2 text-center">
          Success!
        </div>
      </CardContent>
    </Card>

    <section className="space-y-2">
      <div className="w-full h-12 bg-primary text-primary-foreground flex items-center justify-center rounded">
        primary
      </div>
      <div className="w-full h-12 bg-secondary text-secondary-foreground flex items-center justify-center rounded">
        secondary
      </div>
      <div className="w-full h-12 bg-accent text-accent-foreground flex items-center justify-center rounded">
        accent
      </div>
      <div className="w-full h-12 bg-ring text-white flex items-center justify-center rounded">
        ring
      </div>
      <div className="w-full h-12 bg-muted text-muted-foreground flex items-center justify-center rounded">
        muted
      </div>
    </section>
    <Toaster />
  </div>
);
