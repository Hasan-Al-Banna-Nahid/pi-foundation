import AboutUsHero from "./components/About/About";
import AnimatedBanners from "./components/Banner/Banner";
import CampaignSlider from "./components/Campaign/Campaign";
import CharityHero from "./components/CharityHero/CharityHero";
import SuccessStoryBanner from "./components/NeedHelp/NeedHelp";
import SuccessStoryComponent from "./components/successStrory/successStrory";
import OpenDoorsComponent from "./components/OpenDoor/OpenDoor";
import RecentProjects from "./components/RecentProgramm/RecentProgramm";
import Service from "./components/Service/Service";
import VolunteerComponent from "./components/VolunteerScene/VolunteerScene";
import NewsSection from "./components/Blog/Blog";
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
      <NewsSection />
      <Footer />
    </div>
  );
}
