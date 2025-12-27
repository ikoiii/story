import { storyData } from '../../lib/story';
import { motion } from 'framer-motion';

export function StoryOverlay() {
  return (
    <div className="relative z-10 w-full pointer-events-none">
      {storyData.map((section) => (
        <section
          key={section.id}
          className={`min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 
            ${section.alignment === 'left' ? 'items-start text-left' : 
              section.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'}
          `}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {section.text.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-xl text-white/80 mb-4 leading-relaxed font-light tracking-wide last:mb-0"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </section>
      ))}
      
      {/* Footer padding */}
      <div className="h-[30vh]" />
    </div>
  );
}

