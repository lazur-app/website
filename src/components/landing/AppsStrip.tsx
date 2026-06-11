"use client";

import { motion } from "framer-motion";
import { WorksInBar } from "../WorksInBar";
import { SoftCard } from "../SoftCard";

export function AppsStrip() {
  return (
    <section className="landing-section landing-section--apps px-6 pb-8 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <SoftCard hover={false} className="px-6 py-8 md:px-10 md:py-10">
          <WorksInBar />
        </SoftCard>
      </motion.div>
    </section>
  );
}
