'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Registered once for the whole app. Import gsap and plugins from here only.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, Flip, useGSAP);
  gsap.defaults({ ease: 'expo.out', duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, useGSAP, ScrollTrigger, SplitText, MotionPathPlugin, Flip };
