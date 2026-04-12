"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    q: "What is this app about?",
    a: "It's a space where pet parents choose how their dogs connect, whether for mating or socialising. Everything happens through direct, consent-based interactions. The decision is always yours."
  },
  {
    q: "How does matching work?",
    a: "You create a profile, explore options, and choose who you want to connect with. A match happens only when both pet parents agree."
  },
  {
    q: "Can I use the app just for dog socialisation?",
    a: "Yes. Whether it's playdates or regular interaction, it depends on what you want for your dog."
  },
  {
    q: "What makes the platform ethical?",
    a: "There is no pressure, no incentives, and no third-party involvement. Every decision stays with the pet parents."
  },
  {
    q: "How is this different from breeders or pet shops?",
    a: "There are no middlemen here. No one steps in to decide for you. Pet parents connect directly and make decisions on their own terms."
  },
  {
    q: "Is this safe for dogs?",
    a: "Safety comes from responsible choices. The platform gives you the space to communicate clearly and decide what works best for your dog."
  },
  {
    q: "Do vets or experts approve matches?",
    a: "No. The platform does not interfere. Pet parents have full control to make informed decisions based on what they trust."
  },
  {
    q: "How does this benefit pet parents?",
    a: "It keeps everything in your hands. There is no need to rely on multiple platforms. You get transparent options and the freedom to choose what works for you."
  }
];

export const FAQs = () => {
  return (
    <div className="min-h-screen pt-25 bg-white">
      {/* Hero Banner */}
      <div
        className="relative pt-12 pb-20 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4F8EF7 0%, #7B5EA7 100%)"
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font_fredoka">
            Frequently Asked Questions
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to know about PAWnderr. Can't find an answer?{" "}
            <Link
              href="mailto:support@pawnderr.com"
              className="underline text-white font-semibold"
            >
              Contact our team.
            </Link>
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 pt-16 max-w-4xl">
        <Accordion type="multiple" className="space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 px-0"
            >
              <AccordionTrigger className="px-6 py-5 text-left hover:bg-blue-50/50 transition-colors duration-200 hover:no-underline [&>svg]:text-blue-500 [&>svg]:data-[state=closed]:text-gray-400">
                <span className="font-semibold text-grey-900 pr-4 text-base md:text-lg text-left">
                  {item.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-4 text-gray-600 leading-relaxed text-base border-t border-gray-100 bg-blue-50/30">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
