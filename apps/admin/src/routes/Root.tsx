import { RootRoute, Outlet } from "@tanstack/react-router";
import * as React from "react";

export const rootRoute = new RootRoute({
  component: () => {
    return (
      <>
        <Outlet />
      </>
    );
  },
});
