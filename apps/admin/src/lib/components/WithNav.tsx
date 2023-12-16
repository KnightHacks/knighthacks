import { Nav } from "./Nav";

export function WithNav(component: () => JSX.Element) {
  return () => {
    return (
      <>
        <Nav />
        {component()}
      </>
    );
  };
}
