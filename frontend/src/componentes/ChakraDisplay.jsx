import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChakraDisplay() {
  const chakras = [
    {
      name: "Root Chakra (Muladhara)",
      color: "red",
      position: "bottom-10",
      info: "Located at the base of the spine. It represents grounding, stability, and survival instincts. A balanced root chakra gives you a sense of safety and belonging.",
    },
    {
      name: "Sacral Chakra (Svadhisthana)",
      color: "orange",
      position: "bottom-24",
      info: "Located below the navel. It governs creativity, pleasure, emotions, and relationships. Balance brings joy and emotional intelligence.",
    },
    {
      name: "Solar Plexus Chakra (Manipura)",
      color: "yellow",
      position: "bottom-36",
      info: "Located in the upper abdomen. It represents confidence, self-esteem, and willpower. Balance gives you motivation and direction.",
    },
    {
      name: "Heart Chakra (Anahata)",
      color: "green",
      position: "bottom-48",
      info: "Located in the center of the chest. It’s the center of love, compassion, and healing. Balance opens you to connection and kindness.",
    },
    {
      name: "Throat Chakra (Vishuddha)",
      color: "blue",
      position: "bottom-60",
      info: "Located at the throat. It governs communication and self-expression. When balanced, you speak truthfully and clearly.",
    },
    {
      name: "Third Eye Chakra (Ajna)",
      color: "indigo",
      position: "bottom-72",
      info: "Located between the eyebrows. It controls intuition, insight, and imagination. Balance brings clarity and wisdom.",
    },
    {
      name: "Crown Chakra (Sahasrara)",
      color: "violet",
      position: "bottom-80",
      info: "Located at the top of the head. It represents spiritual connection and enlightenment. A balanced crown chakra connects you to higher consciousness.",
    },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <img
        src="/human_silhouette.png"
        alt="Human silhouette"
        className="h-[550px] object-contain"
      />

      {chakras.map((chakra, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute ${chakra.position} bg-${chakra.color}-500 rounded-full w-7 h-7 shadow-[0_0_15px_${chakra.color}] cursor-pointer`}
          onClick={() => setSelected(chakra)}
        ></motion.div>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 max-w-sm shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{selected.name}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{selected.info}</p>
              <button
                onClick={() => setSelected(null)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
