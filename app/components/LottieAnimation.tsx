'use client';

import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../animations/animation.json'; // You'll need to add your JSON file

const LottieAnimation = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LottieAnimation;