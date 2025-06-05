import AboutUsHero from "./components/About/About";
import AnimatedBanners from "./components/Banner/Banner";
import CampaignSlider from "./components/Campaign/Campaign";
import CharityHero from "./components/CharityHero/CharityHero";
import OpenDoorsComponent from "./components/OpenDoor/OpenDoor";
import Service from "./components/Service/Service";
import SuccessStoryComponent from "./components/successStrory/successStrory";
import VolunteerComponent from "./components/VolunteerScene/VolunteerScene";

export default function Home() {
  return (
    <div>
      <AnimatedBanners />
      <Service />
      <AboutUsHero />
      {/* <VolunteerComponent /> */}
      <CampaignSlider />
      <OpenDoorsComponent />
      <CharityHero />
      <SuccessStoryComponent />
    </div>
  );
}
