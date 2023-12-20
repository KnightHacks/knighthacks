import { Navigation } from "./navigation";

export function WithNav(component: () => JSX.Element) {
  return function Layout() {
    return (
      <>
        <Navigation />
        {component()}
      </>
    );
  };
}
