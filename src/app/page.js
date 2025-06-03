import AboutUsHero from "./components/About/About";
import AnimatedBanners from "./components/Banner/Banner";
import Service from "./components/Service/Service";

export default function Home() {
  return (
    <div>
      <AnimatedBanners />
      <Service />
      <AboutUsHero />
    </div>
  );
}
