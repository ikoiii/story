import { storyData } from '../../lib/story';
import { motion } from 'framer-motion';

export function StoryOverlay() {
  return (
    <div className="relative z-10 w-full">
      {storyData.map((section) => (
        <section
          key={section.id}
          className={`min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 
            ${section.alignment === 'left' ? 'items-start text-left' : 
              section.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'}
          `}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="max-w-4xl p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl"
          >
            {section.text.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg md:text-2xl text-slate-200 mb-6 leading-relaxed font-light font-serif tracking-wide last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </section>
      ))}
      
      {/* Footer padding */}
      <div className="h-[50vh]" />
    </div>
  );
}
