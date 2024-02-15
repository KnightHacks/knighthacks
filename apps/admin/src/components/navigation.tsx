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
  const { isLoaded } = useUser();

  const profile = isLoaded ? (
    <UserButton
      afterSignOutUrl={import.meta.env.VITE_ADMIN_AFTER_SIGN_OUT_URL as string}
    />
  ) : (
    <Skeleton className="h-8 w-8 rounded-full" />
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
