import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { PlayIcon } from "@heroicons/react/24/outline";

import { Icons } from "@/components/ui/icons";
import { DarkMode } from "./darkMode";

// "use client"

import * as React from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  return (
    <div className="flex flex-row sm:flex-row  sm: gap-4 py-6 items-center justify-between grid-cols-3 z-50">

      <div className="flex flex-row items-center space-x-2">
        <PlayIcon className="h-8 w-8" />
        <h2 className="text-2xl font-bold">
          <span className="text-gradient"> YTC</span>{" "}
        </h2>
      </div>

      <NavigationMenu className="z-50">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent className="z-20">
              <ul className="grid gap-3 p-4 w-[300px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                {/* Main Overview Link */}
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">YTC</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Unlock insights from YouTube comments and discover songs with Spotify integration.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>

                {/* Step-by-Step List */}
                <ListItem title="1. Search All Video Comments">
                  Enter a YouTube video URL to search for mentions of songs or
                  topics.
                </ListItem>
                <ListItem title="2. Search All Channel Comments">
                  Provide a channel URL or handle (e.g., @channel_name) to search all its videos.
                </ListItem>
                <ListItem title="3. Spotify Integration">
                  Songs found in comments are automatically matched with Spotify
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent className="relative z-20">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          {/* <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}


        </NavigationMenuList>
      </NavigationMenu>

      <DarkMode />


      
    </div>
  );
};

export default Header;

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description: "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description: "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description:
//       "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description:
//       "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ];

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
