import { useState, useEffect, useRef } from "react";

export default function FeatureSection() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (expandedCard === null) return;
      const expandedIndex = expandedCard - 1;
      if (expandedIndex < 0 || expandedIndex > 2) return;
      const expandedCardRef = cardRefs.current[expandedIndex];
      if (expandedCardRef && !expandedCardRef.contains(event.target as Node)) {
        setExpandedCard(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedCard]);

  function handleCardClick(id: number) {
    setExpandedCard((prev) => (prev === id ? null : id));
  }

  const isExpanded = (id: number) => expandedCard === id;

  return (
    <section id="features" className="py-16 text-white bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-4xl font-bold text-center">
          Let us tell you more about
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div
            ref={(el) => {
              if (el) cardRefs.current[0] = el;
            }}
            onClick={() => handleCardClick(1)}
            className={`relative p-4 overflow-hidden rounded shadow-lg cursor-pointer transition-colors ${
              isExpanded(1) ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            {!isExpanded(1) && (
              <img
                src="/images/aboutpadel-img.jpg"
                alt="About Padel"
                className="object-cover w-full h-48 rounded"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">About Padel</h3>
              {isExpanded(1) && (
                <div className="mt-2 text-sm text-gray-200">
                  <p>
                    Padel is a mix between Tennis and Squash. It's usually
                    played in doubles on an enclosed court surrounded by walls
                    of glass and metallic mash.
                  </p>
                  <br></br>
                  <p>
                    The court is one third of the size of a tennis court. The
                    ball can bounce of any wall but can only hit the turf once
                    before being returned.
                  </p>
                  <br />
                  <p>
                    Padel is considered one of the fastest growing sports in the
                    world
                  </p>

                  <a
                    href="https://en.wikipedia.org/wiki/Padel"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    <hr className="my-2 border-gray-600 w-1/2" />
                    Continue reading
                  </a>
                </div>
              )}
            </div>
          </div>

          <div
            ref={(el) => {
              if (el) cardRefs.current[1] = el;
            }}
            onClick={() => handleCardClick(2)}
            className={`relative p-4 overflow-hidden rounded shadow-lg cursor-pointer transition-colors ${
              isExpanded(2) ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            {!isExpanded(2) && (
              <img
                src="/images/membership-img.jpg"
                alt="Membership"
                className="object-cover w-full h-48 rounded"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Read about Membership</h3>
              {isExpanded(2) && (
                <div className="mt-2 text-sm text-gray-200">
                  <p>
                    {" "}
                    Our memberships grant you free booking hours, discounts on
                    gear from our partner shops, and more
                  </p>
                  <br></br>
                  <p>
                    We have 2 tiers of membership depending on your goals in the
                    sport of padel
                  </p>
                  <br />
                  <a
                    href="https://bestpadel.no/bli-medlem/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    <hr className="my-2 border-gray-600 w-1/2" />
                    Continue reading
                  </a>
                </div>
              )}
            </div>
          </div>

          <div
            ref={(el) => {
              if (el) cardRefs.current[2] = el;
            }}
            onClick={() => handleCardClick(3)}
            className={`relative p-4 overflow-hidden rounded shadow-lg cursor-pointer transition-colors ${
              isExpanded(3) ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            {!isExpanded(3) && (
              <img
                src="/images/students-img.jpg"
                alt="Students"
                className="object-cover w-full h-48 rounded"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Students</h3>
              {isExpanded(3) && (
                <div className="mt-2 text-sm text-gray-200">
                  <p>
                    We offer discounted membership plans and free coaching
                    sessions for students.
                  </p>
                  <br />
                  <p>
                    With that in mind you should probably start studying at the
                    premium location for future billionaires in Sandefjord
                  </p>
                  <a
                    href="https://gokstadakademiet.no/campus/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    Continue reading
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
