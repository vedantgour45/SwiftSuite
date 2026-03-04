import React from "react";
import Hero from "../components/Hero";
import Demo from "../components/Demo";

const Summarize = () => {
  return (
    <div className="app border-r border-dashed">
      <Hero
        heading="your articles"
        subHeading="Summarize"
        description="Your Instant Connection to Knowledge. Swiftly summarize lengthy articles
        with our AI-powered tool."
      />
      <Demo />
    </div>
  );
};

export default Summarize;
