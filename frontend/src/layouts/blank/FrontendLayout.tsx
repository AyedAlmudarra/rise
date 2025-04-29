import AnnouncementBar from "@/components/front-pages/layout/AnnouncementBar";
import { Footer } from "@/components/front-pages/layout/Footer";
import FrontHeader from "@/components/front-pages/layout/Header";
import customTheme from "@/utils/theme/custom-theme";
import { Flowbite } from "flowbite-react";
import { Outlet } from "react-router";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useContext, useEffect } from "react";
import { CustomizerContext } from "@/context/CustomizerContext";


const FrontendLayout = () => {
    const {activeMode} = useContext(CustomizerContext);
    useEffect(() => {
        document.documentElement.setAttribute("class",`${activeMode}`)
    },[])
    return (
        <>
        <div className="frontend-page bg-white dark:bg-dark">
        <Flowbite theme={{ theme: customTheme }}>
            <AnnouncementBar />
            <FrontHeader />
            <ScrollToTop>
            <Outlet />
            </ScrollToTop>
            <Footer />
            </Flowbite>
            </div>
        </>
    )
};

export default FrontendLayout;
