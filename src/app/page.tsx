
import EmpowerBusiness from "@/components/site/emp-business";
import Header from "@/components/site/header";
import Hero from "@/components/site/hero";
import SampleMenu from "@/components/site/sample-menu";
import Testimonials from "@/components/site/testimonials";


export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <EmpowerBusiness/>
      <SampleMenu/>
      <Testimonials/>

    </div>
  );
}
