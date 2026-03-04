import React from "react";
import Hero from "../components/Hero";
import LinkShortener from "../components/LinkShortener";

const Shortner = () => {
  return (
    <div className="app">
      <Hero
        heading="Your links"
        subHeading="Shorten"
        description="Transform long URLs into concise and shareable links. Experience the power of simplicity in every link."
      />
      <LinkShortener />
    </div>
  );
};

export default Shortner;
