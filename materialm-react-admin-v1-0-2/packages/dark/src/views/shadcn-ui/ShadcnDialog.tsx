

import BasicDialog from 'src/components/shadcn-ui/Dialog/BasicDialog';
import DialogWithCustomCloseButton from 'src/components/shadcn-ui/Dialog/DialogWithCustomCloseButton';
import DialogWithForm from 'src/components/shadcn-ui/Dialog/DialogWithForm';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Dialog",
    },
  ];
const ShadcnDialog = () => {
  return (
    <>
    <BreadcrumbComp title="Dialog" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicDialog/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <DialogWithCustomCloseButton/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <DialogWithForm/>
      </div>

    </div>
  </>
  )
}

export default ShadcnDialog