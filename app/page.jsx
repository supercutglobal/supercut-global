import { Home } from "../components/Home";
import { HomeSections } from "../components/HomeSections";
import { CompositeRods } from "../components/CompositeRods";
import { HardfacingRope } from "../components/HardfacingRope";

export default function Page() {
  return (
    <>
      <Home />
      <HomeSections>
        <CompositeRods />
        <HardfacingRope />
      </HomeSections>
    </>
  );
}
