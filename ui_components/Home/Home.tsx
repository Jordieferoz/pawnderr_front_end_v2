import {
  Features,
  FindConnections,
  Header,
  Hero,
  PawpStars,
  WhyChooseUs
} from ".";

const Home = () => {
  return (
    <div className="relative">
      <Header />
      <Hero />
      <Features />
      <WhyChooseUs />
      <PawpStars />
      <FindConnections />
    </div>
  );
};

export default Home;
