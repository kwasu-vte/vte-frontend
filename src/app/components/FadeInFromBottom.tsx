"use client";
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface FadeInFromBottomProps {
  children: React.ReactNode;
}

export const FadeInFromBottom: React.FC<FadeInFromBottomProps> = ({ children }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.2, // Trigger the animation when 20% of the component is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
        hidden: { opacity: 0, y: 50 },
      }}
      className=' h-full w-full flex items-center justify-center'
    >
      {children}
    </motion.div>
  );
};
