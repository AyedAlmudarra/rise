import { Card } from "flowbite-react";
 
import CardBox from "src/components/shared/CardBox";
import CodeModal from "../CodeModal";
import s2 from '/src/assets/images/blog/blog-img2.jpg';

const CardWithImage = () => {
  return (
    <div>
      <CardBox>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">Card With Image</h4>
          <CodeModal>
            {`
      import { Card } from "flowbite-react";
      
      <Card
        imgAlt="Meaningful alt text for an image that is not purely decorative"
        imgsrc={s2}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-3">
          Noteworthy technology acquisitions
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2024
          so far, in reverse chronological order.
        </p>
      </Card>  
                `}
          </CodeModal>
        </div>
        <Card
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc={s2}
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-3">
            Noteworthy technology acquisitions
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2024 so
            far, in reverse chronological order.
          </p>
        </Card>
      </CardBox>
    </div>
  );
};

export default CardWithImage;
