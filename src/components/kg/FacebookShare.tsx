import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { facebookShareUrl, type SharePost } from "@/lib/share";
import { cn } from "@/lib/utils";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 fill-current", className)}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    </svg>
  );
}

/** Opens an editable post template, then Facebook's public share link. No login or API. */
export function FacebookShare({
  build,
  path,
  label = "Share on Facebook",
  what,
  className,
  size = "lg",
}: {
  build: (url: string) => SharePost;
  path: string;
  label?: string;
  what: string;
  className?: string;
  size?: "sm" | "lg" | "default";
}) {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState<SharePost>({ text: "", url: "" });
  const [copied, setCopied] = useState(false);

  const onOpenChange = (next: boolean) => {
    if (next) setPost(build(`${window.location.origin}${path}`));
    setCopied(false);
    setOpen(next);
  };

  const fullText = `${post.text}\n${post.url}`;

  const copy = () => {
    navigator.clipboard?.writeText(fullText).catch(() => {});
    setCopied(true);
    toast.success("Post text copied", { description: "Paste it into Facebook if the text doesn't appear." });
  };

  const share = () => {
    window.open(facebookShareUrl(post), "_blank", "noopener,noreferrer,width=640,height=640");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline-sea" size={size} className={className}>
          <FacebookIcon /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Share {what}</DialogTitle>
          <DialogDescription>
            Edit the post below, then open Facebook. You stay in control: nothing is posted until
            you post it there.
          </DialogDescription>
        </DialogHeader>
        <label className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground" htmlFor="fb-post">
          Your post
        </label>
        <Textarea
          id="fb-post"
          value={post.text}
          onChange={(e) => setPost((p) => ({ ...p, text: e.target.value }))}
          rows={6}
          className="rounded-2xl border-2 bg-card text-base"
        />
        <p className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
          Link: <span className="break-all font-bold text-foreground">{post.url}</span>
        </p>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="secondary" size="lg" onClick={copy}>
            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy text"}
          </Button>
          <Button variant="sea" size="lg" onClick={share}>
            <FacebookIcon /> Open Facebook <ExternalLink />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
