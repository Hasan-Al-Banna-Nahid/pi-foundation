"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HandBanner() {
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const threeRef = useRef(null);

  useEffect(() => {
    const animateHands = () => {
      const leftHand = leftHandRef.current;
      const rightHand = rightHandRef.current;
      if (leftHand && rightHand) {
        leftHand.style.transform = "translateY(0)";
        rightHand.style.transform = "translateY(0)";
        setTimeout(() => {
          leftHand.style.transition = "transform 1s ease-in-out";
          rightHand.style.transition = "transform 1s ease-in-out";
          leftHand.style.transform = "translateY(-10px)";
          rightHand.style.transform = "translateY(-10px)";
        }, 100);
        setTimeout(() => {
          leftHand.style.transform = "translateY(0)";
          rightHand.style.transform = "translateY(0)";
        }, 1100);
      }
    };
    animateHands();
    const interval = setInterval(animateHands, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative my-4 w-full max-w-7xl mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="relative bg-teal-900 h-64 sm:h-80 md:h-96 flex items-center justify-center text-white rounded-lg p-4 sm:p-6 md:p-8">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-12 md:h-16 bg-beige-100 rounded-t-lg"></div>
        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 md:h-16 bg-beige-100 rounded-b-lg"></div>
        {/* Content */}
        <div className="text-center z-10 px-4 sm:px-8 md:px-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-fadeIn">
            Our Doors Are Always{" "}
            <span className="text-yellow-400 animate-bounce">Open</span> To
            <br /> More People Who Want To
            <br />{" "}
            <span className="text-yellow-400 animate-bounce">
              Support Each Others!
            </span>
          </h1>
          <button className="mt-4 sm:mt-6 md:mt-8 bg-yellow-400 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 rounded-full hover:bg-yellow-500 animate-pulse text-base sm:text-lg md:text-xl">
            Get Involved
          </button>
        </div>
        {/* Hands with Images */}
        <div className="absolute inset-0 flex justify-between items-center px-4 sm:px-6 md:px-8 z-0">
          <img
            ref={leftHandRef}
            src="/hr.png"
            alt="Left Hand"
            className="w-32 sm:w-40 md:w-48 lg:w-64 h-auto transform translate-y-0 object-contain"
          />
          <img
            ref={rightHandRef}
            src="/hl.png"
            alt="Right Hand"
            className="w-32 sm:w-40 md:w-48 lg:w-64 h-auto transform translate-y-0 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
