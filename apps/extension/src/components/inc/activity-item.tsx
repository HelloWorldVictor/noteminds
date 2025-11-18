import { ChevronRight } from "lucide-react";
import { Flash, MessageQuestion, Edit, FolderOpen } from "iconsax-reactjs";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  variant: keyof typeof variantConfig;
  title: string;
  description: string;
  timestamp: string;
  onClick?: () => void;
}

const variantConfig = {
  summary: { icon: Flash, prefix: "Summary" },
  note: { icon: Edit, prefix: "Note" },
  quiz: { icon: MessageQuestion, prefix: "Quiz" },
  library: { icon: FolderOpen, prefix: "Library" },
};

export function ActivityItem({
  variant = "summary",
  title,
  description,
  timestamp,
  onClick,
}: ActivityItemProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <Item onClick={onClick}>
      <ItemMedia>
        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
          <IconComponent size={16} />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {config.prefix} • {title}
        </ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{timestamp}</span>
          <ChevronRight className="text-muted-foreground size-4.5" />
        </div>
      </ItemActions>
    </Item>
  );
}
