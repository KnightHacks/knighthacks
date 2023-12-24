import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "wouter";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Skeleton } from "./ui/skeleton";
import { ThemeToggle } from "./ui/theme-toggle";

export function Navigation() {
  const { isSignedIn, isLoaded } = useUser();

  const profile = isSignedIn ? (
    <UserButton />
  ) : isLoaded ? (
    <Link href="/signin">Sign In</Link>
  ) : (
    <Skeleton className="h-8 w-32 rounded-md" />
  );

  return (
    <div className="flex items-center justify-between p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Overview
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/users">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Users
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/sponsors">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sponsors
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/hackathons">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Hackathons
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/hackers">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Hackers
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {profile}
      </div>
    </div>
  );
}
