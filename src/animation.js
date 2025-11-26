// import { gsap } from "gsap";
// import { useGSAP } from "@gsap/react";

// import { CustomEase } from "gsap/CustomEase";
// // CustomBounce requires CustomEase
// import { CustomBounce } from "gsap/CustomBounce";
// // CustomWiggle requires CustomEase
// import { CustomWiggle } from "gsap/CustomWiggle";
// import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
    
// import { Draggable } from "gsap/Draggable";
// import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// import { EaselPlugin } from "gsap/EaselPlugin";
// import { Flip } from "gsap/Flip";
// import { GSDevTools } from "gsap/GSDevTools";
// import { InertiaPlugin } from "gsap/InertiaPlugin";
// import { MotionPathHelper } from "gsap/MotionPathHelper";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
// import { Observer } from "gsap/Observer";
// import { Physics2DPlugin } from "gsap/Physics2DPlugin";
// import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
// import { PixiPlugin } from "gsap/PixiPlugin";
// import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// // ScrollSmoother requires ScrollTrigger
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { SplitText } from "gsap/SplitText";
// import { TextPlugin } from "gsap/TextPlugin";

// gsap.registerPlugin(useGSAP,Draggable,DrawSVGPlugin,EaselPlugin,Flip,GSDevTools,InertiaPlugin,MotionPathHelper,MotionPathPlugin,MorphSVGPlugin,Observer,Physics2DPlugin,PhysicsPropsPlugin,PixiPlugin,ScrambleTextPlugin,ScrollTrigger,ScrollSmoother,ScrollToPlugin,SplitText,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase,CustomBounce,CustomWiggle);



// animations.js
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(
  CustomEase,
  CustomBounce,
  CustomWiggle,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  DrawSVGPlugin,
  MotionPathPlugin
);

// Animate sun rays rotation
export function animateSunRays() {
  const sunRays = document.querySelector("#solstriber");
  
  if (sunRays) {
    // Get the sun's center point (the circle center)
    const sunCircle = sunRays.closest('svg').querySelector('circle');
    const cx = sunCircle ? sunCircle.getAttribute('cx') : '180.09';
    const cy = sunCircle ? sunCircle.getAttribute('cy') : '153.06';
    
    // Set transform origin to the center of the sun
    gsap.set(sunRays, {
      transformOrigin: `${cx}px ${cy}px`
    });
    
    // Rotate 360 degrees continuously
    gsap.to(sunRays, {
      rotation: 360,
      duration: 20,
      ease: "none",
      repeat: -1
    });
  }
}

// Animate clouds floating
export function animateClouds() {
  const clouds = document.querySelectorAll(".weather-icon svg path[class*='cls']");
  
  clouds.forEach((cloud, index) => {
    gsap.to(cloud, {
      x: "+=10",
      duration: 3 + index,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.3
    });
  });
}

// Animate rain drops
export function animateRain() {
  const rainDrops = document.querySelectorAll(".weather-icon svg path[class*='cls-2']");
  
  rainDrops.forEach((drop, index) => {
    gsap.to(drop, {
      y: "+=15",
      opacity: 0.3,
      duration: 0.8,
      ease: "power1.in",
      repeat: -1,
      delay: index * 0.2
    });
  });
}

// Animate lightning bolt
export function animateLightning() {
  const lightning = document.querySelector(".weather-icon svg path[class*='cls-8']");
  
  if (lightning) {
    gsap.timeline({ repeat: -1, repeatDelay: 3 })
      .to(lightning, {
        opacity: 1,
        duration: 0.1
      })
      .to(lightning, {
        opacity: 0.3,
        duration: 0.1
      })
      .to(lightning, {
        opacity: 1,
        duration: 0.05
      })
      .to(lightning, {
        opacity: 0.3,
        duration: 2
      });
  }
}

// Animate snowflakes
export function animateSnow() {
  const snowflakes = document.querySelectorAll(".weather-icon svg path[class*='cls-1']");
  
  snowflakes.forEach((flake, index) => {
    gsap.to(flake, {
      y: "+=20",
      x: "random(-5, 5)",
      rotation: "random(-180, 180)",
      duration: "random(2, 4)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.3
    });
  });
}

// Animate wind lines
export function animateWind() {
  const windLines = document.querySelectorAll(".weather-icon svg path[class*='cls-6']");
  
  windLines.forEach((line, index) => {
    gsap.fromTo(line, {
      x: -50,
      opacity: 0
    }, {
      x: 50,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      repeat: -1,
      delay: index * 0.4
    });
  });
}

// Main function to animate based on weather condition
export function animateWeatherIcon(iconCode) {
  // Clear any existing animations
  gsap.killTweensOf(".weather-icon svg *");
  
  // Fade in the icon
  gsap.from(".weather-icon svg", {
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    ease: "back.out(1.7)"
  });
  
  // Apply specific animations based on weather icon code
  switch(iconCode) {
    case '01d': // Clear sky day
    case '01n': // Clear sky night
      animateSunRays();
      break;
      
    case '02d': // Few clouds day
    case '02n': // Few clouds night
      animateSunRays();
      animateClouds();
      break;
      
    case '03d': // Scattered clouds
    case '03n':
    case '04d': // Broken clouds
    case '04n':
      animateClouds();
      break;
      
    case '09d': // Shower rain
    case '09n':
    case '10d': // Rain
    case '10n':
      animateRain();
      animateClouds();
      break;
      
    case '11d': // Thunderstorm
    case '11n':
      animateLightning();
      animateRain();
      animateClouds();
      break;
      
    case '13d': // Snow
    case '13n':
      animateSnow();
      animateClouds();
      break;
      
    case '50d': // Mist/fog
    case '50n':
      animateClouds();
      break;
      
    default:
      // Default subtle animation
      gsap.to(".weather-icon svg", {
        y: "+=10",
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
  }
}




