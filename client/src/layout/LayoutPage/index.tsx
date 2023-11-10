import { Outlet } from 'react-router-dom';

import Wrapper from '../Wrapper';
import Navbar from '../Navbar';
import Main from '../Main';
import Footer from '../Footer';

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
