

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
