import {
  Features,
  FindConnections,
  Header,
  Hero,
  LoyalCompanions,
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
      <LoyalCompanions />
    </div>
  );
};

export default Home;
