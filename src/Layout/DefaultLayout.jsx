import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import NavbarWrapper from "@/Components/Header/NavbarWrapper";


export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  );
}

