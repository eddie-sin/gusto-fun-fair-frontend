'use client';

import type { LucideIcon } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormattedMessage } from '@/components/formatted-message';

export function FloatingGuide({ icon: Icon, label, title, description, message }: { icon: LucideIcon; label: string; title: string; description: string; message: string }) {
  return <Dialog>
    <DialogTrigger className="floating-guide-fab" aria-label={label}>
      <Icon aria-hidden="true" size={24} />
    </DialogTrigger>
    <DialogContent className="floating-guide-dialog">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="floating-guide-body"><FormattedMessage text={message} /></div>
      <DialogClose className="button button--full">Got it</DialogClose>
    </DialogContent>
  </Dialog>;
}
