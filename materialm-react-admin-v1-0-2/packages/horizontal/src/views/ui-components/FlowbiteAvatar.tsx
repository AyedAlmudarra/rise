import AvatarWithText from "src/components/ui-components/Avatar/AvatarWithText";
import BorderAvatar from "src/components/ui-components/Avatar/BorderAvatar";
import ColorAvatar from "src/components/ui-components/Avatar/ColorAvatar";
import DefaultAvatar from "src/components/ui-components/Avatar/DefaultAvatar";
import DotIndicator from "src/components/ui-components/Avatar/DotIndicator";
import ImageOverride from "src/components/ui-components/Avatar/ImageOverride";
import IntitalAvatar from "src/components/ui-components/Avatar/IntitalAvatar";
import PlaceholderAvatar from "src/components/ui-components/Avatar/PlaceholderAvatar";
import SizeAvatar from "src/components/ui-components/Avatar/SizeAvatar";
import StackAvatar from "src/components/ui-components/Avatar/StackAvatar";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Avatar",
  },
];
const FlowbiteAvatar = () => {
  return (
    <>
      <BreadcrumbComp title="Avatar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <DefaultAvatar />
        </div>
        {/* Border Avatar */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <BorderAvatar />
        </div>
        {/* Placeholder Avatar */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <PlaceholderAvatar />
        </div>
        {/* Intital Avatar */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <IntitalAvatar />
        </div>
        {/* Dot Avatar */}
        <div className="lg:col-span-4 col-span-12">
          <DotIndicator />
        </div>
        {/* Image Override */}
        <div className="lg:col-span-4 col-span-12">
          <ImageOverride />
        </div>
        {/* Avatar With Text */}
        <div className="lg:col-span-4 col-span-12">
          <AvatarWithText />
        </div>
        {/* Color Avatar */}
        <div className="lg:col-span-4 col-span-12">
          <ColorAvatar />
        </div>
        {/* Stack Avatar */}
        <div className="lg:col-span-4 col-span-12">
          <StackAvatar />
        </div>
        {/* Size Avatar */}
        <div className="lg:col-span-4 col-span-12">
          <SizeAvatar />
        </div>
      </div>
    </>
  );
};

export default FlowbiteAvatar;
