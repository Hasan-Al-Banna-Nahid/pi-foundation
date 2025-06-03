import AboutUsHero from "./components/About/About";
import AnimatedBanners from "./components/Banner/Banner";
import CampaignSlider from "./components/Campaign/Campaign";
import OpenDoorsComponent from "./components/OpenDoor/OpenDoor";
import Service from "./components/Service/Service";
import SuccessStories from "./components/successStories/successStories";
import VolunteerComponent from "./components/VolunteerScene/VolunteerScene";

export default function Home() {
  return (
    <div>
      <AnimatedBanners />
      <Service />
      <AboutUsHero />
      <VolunteerComponent />
      <CampaignSlider />
      <OpenDoorsComponent />
      <SuccessStories />
    </div>
  );
}
