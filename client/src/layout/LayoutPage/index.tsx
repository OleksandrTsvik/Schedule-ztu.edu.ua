import { Outlet } from 'react-router-dom';

import { Footer, Main, Navbar, Wrapper } from '..';

export default function LayoutPage() {
  return (
    <Wrapper>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
}
