import CardBox from "@/components/shared/CardBox";
import avatar1 from "@/assets/images/profile/user-1.jpg";
import avatar2 from "@/assets/images/profile/user-2.jpg";
import avatar3 from "@/assets/images/profile/user-3.jpg";
import img1 from "@/assets/images/blog/blog-img1.jpg";
import img2 from "@/assets/images/blog/blog-img2.jpg";
import img3 from "@/assets/images/blog/blog-img3.jpg";
import { Badge } from "flowbite-react";
import { IconEye, IconMessage2, IconPoint } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const BlogCardsData = [
  {
    avatar: avatar1,
    coveravatar: img1,
    read: "2 min Read",
    title: "As yen tumbles, gadget-loving Japan goes for secondhand iPhones",
    category: "Social",
    name: "Georgeanna Ramero",
    view: "9,125",
    comments: "3",
    time: "Mon, Dec 19",
    url:''
  },
  {
    avatar: avatar2,
    coveravatar: img2,
    read: "2 min Read",
    title:
      "Intel loses bid to revive antitrust case against patent foe Fortress",
    category: "Gadget",
    name: "Georgeanna Ramero",
    view: "4,150",
    comments: "38",
    time: "Sun, Dec 18",
    url:''
  },
  {
    avatar: avatar3,
    coveravatar: img3,
    read: "2 min Read",
    title: "COVID outbreak deepens as more lockdowns loom in China",
    category: "Health",
    name: "Georgeanna Ramero",
    view: "9,480",
    comments: "12",
    time: "Sat, Dec 17",
    url:''
  },
];

const BlogCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-[30px] mt-[30px]">
        {BlogCardsData.map((item, i) => (
          <div className="lg:col-span-4 col-span-12" key={i}>
            <Link to={item.url} className="group">
              <CardBox className="p-0 overflow-hidden ">
                <div className="relative">
                  <img src={item.coveravatar} alt="MatDash" />
                  <Badge
                    color={"muted"}
                    className="absolute bottom-5 end-5 font-semibold"
                  >
                    {item.read}
                  </Badge>
                </div>

                <div className="px-6 pb-6">
                  <img
                    src={item.avatar}
                    className="h-10 w-10 rounded-full -mt-7 relative z-1"
                    alt="user"
                  />
                  <Badge color={"muted"} className="mt-6">
                    {item.category}
                  </Badge>
                  <h5 className="text-lg my-6 group-hover:text-primary">{item.title}</h5>
                  <div className="flex">
                    <div className="flex gap-2 me-6 items-center">
                      <IconEye
                        size={17}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.view}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <IconMessage2
                        size={17}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.view}</span>
                    </div>
                    <div className="flex gap-1 items-center ms-auto">
                      <IconPoint
                        size={10}
                        className="text-dark dark:text-white"
                      />{" "}
                      <span className="text-sm text-bodytext">{item.time}</span>
                    </div>
                  </div>
                </div>
              </CardBox>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogCards;
