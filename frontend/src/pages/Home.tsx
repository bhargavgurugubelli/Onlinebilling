import React from 'react';
import Hero from '../components/Hero'; // ✅ Hero from components
import StepsSection from '../components/StepsSection';
import ThreeSteps from '../components/ThreeSteps';
import WhoIsItFor from '../components/WhoIsItFor';
import MoreFeatures from '../components/MoreFeatures';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';

const Home = (): JSX.Element => {
  return (
    <div id="home">
      <Hero />
      <StepsSection />
      <ThreeSteps />
      <WhoIsItFor /> 
      <MoreFeatures />   
      <Pricing />
      <Contact />
    </div>
  );
};

export default Home;
