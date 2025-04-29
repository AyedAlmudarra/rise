import Questions from "@/components/theme-pages/faq/Questions";
import StillHaveQst from "@/components/theme-pages/faq/StillHaveQst";
import BreadcrumbComp from "@/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "FAQ",
  },
];

const faq = () => {
  return (
    <>
      <BreadcrumbComp title="FAQ" items={BCrumb} />
      <Questions />
      <StillHaveQst />
    </>
  );
};

export default faq;
