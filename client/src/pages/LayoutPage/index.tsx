import Wrapper from '../../layout/Wrapper';
import Navbar from '../../layout/Navbar';
import Main from '../../layout/Main';
import Footer from '../../layout/Footer';

export default function LayoutPage() {
  return (
    <Wrapper>
      <Navbar />
      <Main>Hello JS developer ;)</Main>
      <Footer />
    </Wrapper>
  );
}
