

import BasicCarousel from 'src/components/shadcn-ui/Carousel/BasicCarousel';
import CarouselWithultipleItem from 'src/components/shadcn-ui/Carousel/CarouselWithultipleItem';
import { VerticalCarousel } from 'src/components/shadcn-ui/Carousel/VerticalCarousel';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';


  
  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Curosel",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Curosel" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicCarousel/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <VerticalCarousel/>
      </div>
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <CarouselWithultipleItem/>
      </div>
    </div>
  </>
  )
}

export default page