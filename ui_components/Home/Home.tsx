import {
  Features,
  FindConnections,
  Header,
  Hero,
  LoyalCompanions,
  PawpStars,
  TailsOfLove,
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
      <TailsOfLove />
    </div>
  );
};

export default Home;
