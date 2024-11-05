import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Technolodgies = () => {
  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      <p className="text-center: text-muted-foreground lg:text-left">
        Built with open-source technologies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), "group px-3")}
        >
          <img
            src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui-small.svg"
            alt="company logo"
            className="h-6 saturate-0 transition-all group-hover:saturate-100"
          />
        </a>
        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), "group px-3")}
        >
          <img
            src="https://www.shadcnblocks.com/images/block/logos/typescript-small.svg"
            alt="company logo"
            className="h-6 saturate-0 transition-all group-hover:saturate-100"
          />
        </a>

        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), "group px-3")}
        >
          <img
            src="https://www.shadcnblocks.com/images/block/logos/react-icon.svg"
            alt="company logo"
            className="h-6 saturate-0 transition-all group-hover:saturate-100"
          />
        </a>
        <a
          href="#"
          className={cn(buttonVariants({ variant: "outline" }), "group px-3")}
        >
          <img
            src="https://www.shadcnblocks.com/images/block/logos/tailwind-small.svg"
            alt="company logo"
            className="h-4 saturate-0 transition-all group-hover:saturate-100"
          />
        </a>
      </div>
    </div>
  );
};

export default Technolodgies;
