import {
  BrowseProfiles,
  Features,
  FindConnections,
  Hero,
  LoyalCompanions,
  PawpStars,
  TailsOfLove,
  WhyChooseUs
} from ".";

const Home = () => {
  return (
    <div className="relative">
      <Hero />
      <Features />
      <WhyChooseUs />
      <PawpStars />
      <FindConnections />
      <LoyalCompanions />
      <TailsOfLove />
      <BrowseProfiles />
    </div>
  );
};

export default Home;
