import SwipingCards from "@/ui_components/Dashboard/SwipingCards";

export default function DashboardPage() {
  return (
    <div className="">
      <h1 className="display3 my-4">Discover</h1>
      <div className="flex items-center gap-4 mb-16">
        {/* <div className="cursor-pointer">
          <img src={images.filterIcon.src} />
        </div> */}
      </div>

      <SwipingCards />
    </div>
  );
}
