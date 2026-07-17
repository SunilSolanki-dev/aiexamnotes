import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { createCreditsOrder } from '../services/api'

const PLANS = [
  {
    title: "Starter",
    description: "Perfect for quick revisions",
    price: 100,
    credits: 50,
    features: ["Generate AI notes", "Exam-focused answers", "Diagram & chart support", "Fast generation"],
  },
  {
    title: "Popular",
    description: "Best value for students",
    price: 200,
    credits: 120,
    popular: true,
    features: ["All Starter features", "More credits per ₹", "Revision mode access", "Priority AI response"],
  },
  {
    title: "Pro Learner",
    description: "For serious exam preparation",
    price: 500,
    credits: 300,
    features: ["Maximum credit value", "Unlimited revisions", "Charts & diagrams", "Ideal for full syllabus"],
  },
];

function Pricing() {
  const navigate = useNavigate();
  const [payingAmount, setPayingAmount] = useState(null);
  const [error, setError] = useState("");

  const handleBuy = async (amount) => {
    setError("");
    setPayingAmount(amount);
    try {
      const res = await createCreditsOrder(amount);
      if (res?.url) {
        window.location.href = res.url;
      } else {
        setError("Unable to start checkout. Please try again.");
        setPayingAmount(null);
      }
    } catch (err) {
      console.log('error', err);
      setError("Failed to start checkout. Please try again.");
      setPayingAmount(null);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4 sm:px-6 py-8'>
      <button
        onClick={() => navigate(-1)}
        className='cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition'
      >
        <span>◀</span> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center mt-6 mb-10'
      >
        <h1 className='text-3xl font-bold text-gray-900'>Buy Credits</h1>
        <p className='text-gray-500 mt-2'>Choose a plan that fits your study needs</p>
      </motion.div>

      {error && (
        <p className='text-center text-red-600 font-medium mb-6'>{error}</p>
      )}

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'>
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.title}
            plan={plan}
            paying={payingAmount !== null}
            isPaying={payingAmount === plan.price}
            onBuy={() => handleBuy(plan.price)}
          />
        ))}
      </div>
    </div>
  )
}

function PricingCard({ plan, paying, isPaying, onBuy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-2xl bg-white p-6 shadow-sm border ${plan.popular ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-200"
        }`}
    >
      {plan.popular && (
        <span className='absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold'>
          Popular
        </span>
      )}

      <h3 className='text-lg font-semibold text-gray-900'>{plan.title}</h3>
      <p className='text-sm text-gray-500 mt-1'>{plan.description}</p>

      <div className='mt-4'>
        <span className='text-3xl font-bold text-gray-900'>₹{plan.price}</span>
        <p className='text-sm text-indigo-600 font-medium mt-1'>{plan.credits} Credits</p>
      </div>

      <motion.button
        whileHover={!paying ? { scale: 1.02 } : {}}
        whileTap={!paying ? { scale: 0.97 } : {}}
        onClick={onBuy}
        disabled={paying}
        className={`w-full mt-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
      >
        {isPaying ? "Redirecting..." : "Buy Now"}
      </motion.button>

      <ul className='mt-5 space-y-2'>
        {plan.features.map((feature) => (
          <li key={feature} className='flex items-start gap-2 text-sm text-gray-600'>
            <span className='text-emerald-500'>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default Pricing
