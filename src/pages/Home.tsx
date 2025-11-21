import Hero from "../components/Hero";
import About from "../components/About";
import Industries from "../components/Industries";
import Process from "../components/Process";
import Products from "../components/Products";
import BlogUpdates from "../components/BlogUpdates";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Industries />
      <Process />
      <Products />
      <BlogUpdates />
    </>
  );
}