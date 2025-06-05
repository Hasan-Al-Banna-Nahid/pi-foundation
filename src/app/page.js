import AboutUsHero from "./components/About/About";
import AnimatedBanners from "./components/Banner/Banner";
import CampaignSlider from "./components/Campaign/Campaign";
import SuccessStoryBanner from "./components/NeedHelp/NeedHelp";
import CharityHero from "./components/CharityHero/CharityHero";
import SuccessStoryComponent from "./components/OpenDoor/OpenDoor";
import OpenDoorsComponent from "./components/OpenDoor/OpenDoor";
import Service from "./components/Service/Service";
import NewsSection from "./components/Blog/Blog";
import FounderBanner from "./components/Founder/Founder";
import RecentProjects from "./components/RecentProgramm/RecentProgramm";
import VolunteerComponent from "./components/VolunteerScene/VolunteerScene";
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
      <RecentProjects />
      <NewsSection />
      <FounderBanner />
      <Footer />
    </div>
  );
}
