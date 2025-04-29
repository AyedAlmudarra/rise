import { Accordion } from "flowbite-react";


export const FaqComponent = () => {
  const Questions = [
    {
      key: "rise-q1",
      question: "What is RISE?",
      answer:
        "RISE is a platform designed to connect innovative startups with relevant investors in the Saudi market. We leverage AI-driven analysis to facilitate matchmaking and provide valuable insights for both parties.",
    },
    {
      key: "rise-q2",
      question: "How does RISE help startups?",
      answer:
        "Startups can create detailed profiles, receive AI-powered analysis on their business and funding readiness, gain visibility among a curated network of investors, and manage their fundraising outreach process efficiently.",
    },
    {
      key: "rise-q3",
      question: "How does RISE benefit investors?",
      answer:
        "Investors gain access to a vetted pool of startups, utilize AI-driven recommendations based on their investment thesis, streamline deal flow management, access data rooms, and track portfolio performance.",
    },
    {
      key: "rise-q4",
      question:
        "Is my company data secure on the platform?",
      answer:
        "Data security is a top priority. We utilize robust infrastructure and implement strict access controls (including Row Level Security in our database) to protect your confidential information. Refer to our Privacy Policy for full details.",
    },
    {
      key: "rise-q5",
      question: "How does the AI analysis work?",
      answer:
        "Our AI analyzes the comprehensive data provided in a startup's profile, including financials, market positioning, team, and metrics, to generate insights on strengths, weaknesses, opportunities, threats (SWOT), funding readiness, and key performance indicators (KPIs).",
    },
    {
      key: "rise-q6",
      question: "How do I get started on RISE?",
      answer:
        "Simply click the 'Register' button, choose whether you are a Startup or Investor, and complete the guided registration process. Once your profile is set up, you can begin exploring the platform's features.",
    },
  ];
  return (
    <>
      <div id="faq" className="dark:bg-dark lg:py-24 py-12">
        <div className="max-w-[800px] mx-auto px-5">
          <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white text-center mb-14">
            Frequently Asked Questions
          </h2>
          <Accordion className="shadow-none dark:shadow-none divide-y-1 divide-b-0 divided:border-ld !rounded-none flex flex-col gap-4">
            {Questions.map((item) => {
              return (
               
                  <Accordion.Panel key={item.key}>
                    <Accordion.Title className="focus:ring-0 px-6 text-lg text-ld py-5 border border-ld rounded-md !border-b-none">
                      {item.question}
                    </Accordion.Title>
                    <Accordion.Content className="!p-0 px-0 pt-0 rounded-none">
                      <p className="text-base text-darklink leading-7 border border-t-0 border-ld -mt-5 px-6 py-5 rounded-b-md">
                        {item.answer}
                      </p>
                    </Accordion.Content>
                  </Accordion.Panel>
               
              );
            })}
          </Accordion>
          <p className="mt-14 text-sm font-medium justify-center text-darklink flex flex-wrap items-center gap-1 border border-dashed w-fit mx-auto px-3 py-1.5 rounded-md">
            Still have a question?{" "}
            <a
              href="/app/help/contact"
              className="underline hover:text-primary"
            >
              Contact Support
            </a>{" "}
            <span>or</span>
            <a
              href="https://discord.com/invite/eMzE8F6Wqs"
              className="underline hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask On Discord
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
