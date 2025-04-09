
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import BasicButton from 'src/components/shadcn-ui/Button/BasicButton';
import OutlineButton from 'src/components/shadcn-ui/Button/OutlineButton';
import GhostButton from 'src/components/shadcn-ui/Button/GhostButton';
import ButtonWithIcon from 'src/components/shadcn-ui/Button/ButtonWithIcon';
import LoadingButton from 'src/components/shadcn-ui/Button/LoadingButton';


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button",
  },
];

const ShadcnButton = () => {
  return (
    <>
    <BreadcrumbComp title="Button" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <OutlineButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <GhostButton />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <ButtonWithIcon />
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <LoadingButton />
      </div>

    </div>
  </>
  )
}

export default ShadcnButton