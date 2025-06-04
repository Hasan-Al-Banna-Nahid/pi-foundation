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
    <div className="relative my-8 w-full max-w-6xl mx-auto overflow-hidden">
      {/* 3D Moving Objects */}
      {/* <div
        ref={threeRef}
        className="absolute top-0 left-0 w-full h-24 z-20"
      ></div> */}
      <div className="relative bg-teal-900 h-80 flex items-center justify-center text-white rounded-lg p-8">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-beige-100 rounded-t-lg"></div>
        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-beige-100 rounded-b-lg"></div>
        {/* Gradient Heading */}
        {/* <h2 className="absolute top-2 left-4 text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-teal-500 bg-clip-text text-transparent">
          Welcome Banner
        </h2> */}
        {/* Content - Enlarged */}
        <div className="text-center z-10 px-12">
          <h1 className="text-4xl md:text-5xl font-bold animate-fadeIn">
            Our Doors Are Always{" "}
            <span className="text-yellow-400 animate-bounce">Open</span> To
            <br /> More People Who Want To
            <br />{" "}
            <span className="text-yellow-400 animate-bounce">
              Support Each Others!
            </span>
          </h1>
          <button className="mt-8 bg-yellow-400 text-white font-bold py-4 px-8 rounded-full hover:bg-yellow-500 animate-pulse text-xl">
            Get Involved
          </button>
        </div>
        {/* Hands with Images - Adjusted Size and Position */}
        <div className="absolute inset-0 flex justify-between items-center px-8 z-0">
          <img
            ref={leftHandRef}
            src="/hr.png"
            alt="Left Hand"
            className="w-64 h-42 transform translate-y-0"
          />
          <img
            ref={rightHandRef}
            src="/hl.png"
            alt="Right Hand"
            className="w-64 h-42 transform translate-y-0"
          />
        </div>
      </div>
    </div>
  );
}
