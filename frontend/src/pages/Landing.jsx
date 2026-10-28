import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import side from "../assets/MedVerify.png";
import { motion } from "framer-motion";

export default function Landing() {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="font-sans text-gray-900">

      {/* HERO SECTION */}
      <section className="w-screen flex flex-col md:flex-row min-h-screen">
        {/* Left Text Section */}
        <motion.div
          className="relative md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 py-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
     

          {/* Pill Banner */}
          <div className="mb-2">
            <Link to="/login">
              <a className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                Get yourself login
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4 text-center">
          Cloud-Powered Platform for <span className="text-purple-400">Tracking Medicine</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 text-center">
         A secure and intuitive platform designed to help NGOs efficiently manage and verify their medicine inventories. Track quantities, monitor expiry dates.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-black text-white hover:bg-black/90">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <div className="relative md:w-1/2 h-screen">
          <img src={side} alt="Hero side" className="h-full w-full object-cover" />
          <div className="absolute left-0 top-0 h-full w-20 md:w-40 bg-gradient-to-r from-white to-transparent"></div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-gray-50">
        <motion.div
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Easy Inventory</h3>
            <p className="text-gray-600">
              Track medicines in real-time, view quantities and expiry dates effortlessly.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
            <p className="text-gray-600">
              JWT-based authentication ensures only authorized users can access your data.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Verified NGOs</h3>
            <p className="text-gray-600">
              Only registered NGOs can add or view medicines, keeping your inventory reliable.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <motion.div
          className="max-w-6xl mx-auto px-6 space-y-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-2">1. Sign Up</h3>
            <p className="text-gray-700">
              Create your NGO account quickly and securely to start managing medicines.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-2">2. Add Medicines</h3>
            <p className="text-gray-700">
              Enter medicine details: name, manufacturer, quantity, expiry date — all organized and verified.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-2">3. Dashboard Overview</h3>
            <p className="text-gray-700">
              View inventory at a glance, monitor expiry dates, and manage medicines efficiently.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gray-50 text-center px-6">
        <motion.h2 className="text-3xl font-semibold mb-6" variants={fadeUp} initial="hidden" whileInView="visible">
          Ready to simplify your NGO’s medicine management?
        </motion.h2>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
          <Link to="/signup">
            <Button className="px-8 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Create Your Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-white text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} AuthMed — All rights reserved.
      </footer>
    </div>
  );
}
