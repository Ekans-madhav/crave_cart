import { useEffect, useRef, useState } from "react";

export default function AnimatedHeading() {
  const [play, setPlay] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log(entry)
        if (entry.isIntersecting) {
          setPlay(false); // reset
          setTimeout(() => setPlay(true), 50); // replay
        }
      },
      { threshold: 0.6 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const line1 = [
    "D",
    "e",
    "l",
    "i",
    "c",
    "i",
    "o",
    "u",
    "s",
    " ",
    "F",
    "🍩",
    "🍩",
    "d",
  ];

  const line2 = [
    "D",
    "e",
    "l",
    "i",
    "v",
    "e",
    "r",
    "e",
    "d",
    " ",
    "F",
    "a",
    "s",
    "t",
  ];

  return (
    <div ref={ref} className="text-center space-y-4">
      <h1
        className="flex justify-center flex-wrap 
        text-6xl md:text-7xl lg:text-8xl font-bold"
      >
        {line1.map((char, i) =>
          char === "🍩" ? (
            <span
              key={i}
              className={`inline-block mx-1 text-7xl md:text-8xl
                ${play ? "animate-donut" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              🍩
            </span>
          ) : (
            <span
              key={i}
              className={`inline-block bg-gradient-to-r 
              from-orange-600 via-red-600 to-pink-600 
              bg-clip-text text-transparent
              ${play ? "animate-letter" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {char}
            </span>
          ),
        )}
      </h1>
        {/* {ref.current && console.log(ref.current)} */} 
      <h2
        className="flex justify-center flex-wrap 
        text-4xl md:text-5xl lg:text-6xl font-bold"
      >
        {line2.map((char, i) => (
          <span
            key={i}
            className={`inline-block bg-gradient-to-r 
            from-orange-600 via-red-600 to-pink-600 
            bg-clip-text text-transparent
            ${play ? "animate-letter" : "opacity-0"}`}
            style={{ animationDelay: `${i * 0.08 + 1}s` }}
          >
            {char}
          </span>
        ))}
      </h2>
    </div>
  );
}
