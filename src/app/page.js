import dynamic from "next/dynamic";

// 💡 Dynamically loaded (animation-heavy or big assets)
const AnimatedBanners = dynamic(() => import("./components/Banner/Banner"), {
  ssr: false,
});
const CharityHero = dynamic(
  () => import("./components/CharityHero/CharityHero"),
  { ssr: false }
);
const VolunteerComponent = dynamic(
  () => import("./components/VolunteerScene/VolunteerScene"),
  { ssr: false }
);
const SuccessStoryComponent = dynamic(
  () => import("./components/successStrory/successStrory"),
  { ssr: false }
);
const OpenDoorsComponent = dynamic(
  () => import("./components/OpenDoor/OpenDoor"),
  { ssr: false }
);

// 💡 Non-blocking / fast render
import AboutUsHero from "./components/About/About";
import CampaignSlider from "./components/Campaign/Campaign";
import SuccessStoryBanner from "./components/NeedHelp/NeedHelp";
import RecentProjects from "./components/RecentProgramm/RecentProgramm";
import Service from "./components/Service/Service";
import NewsSection from "./components/Blog/Blog";
import FounderBanner from "./components/Founder/Founder";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <AnimatedBanners />
      <Service />
      <AboutUsHero />
      <CampaignSlider />
      <OpenDoorsComponent />
      <CharityHero />
      <SuccessStoryBanner />
      <SuccessStoryComponent />
      <RecentProjects />
      <VolunteerComponent />
      <NewsSection />
      <FounderBanner />
      <Footer />
    </div>
  );
}
