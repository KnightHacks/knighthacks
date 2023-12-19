import { Navigation } from './navigation';

export function WithNav(component: () => JSX.Element) {
  return () => {
    return (
      <>
        <Navigation />
        {component()}
      </>
    );
  };
}
