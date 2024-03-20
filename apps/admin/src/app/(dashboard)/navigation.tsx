"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@knighthacks/ui/navigation";
import { Skeleton } from "@knighthacks/ui/skeleton";

export function Navigation() {
  const { isLoaded } = useUser();

  const profile = isLoaded ? (
    <UserButton afterSignOutUrl="/sign-up" />
  ) : (
    <Skeleton className="h-8 w-8 rounded-full" />
  );

  return (
    <div className="flex items-center justify-between p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" passHref legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Overview
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/users" passHref legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Users
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/sponsors" passHref legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sponsors
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/hackathons" passHref legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Hackathons
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/hackers" passHref legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Hackers
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">{profile}</div>
    </div>
  );
}
