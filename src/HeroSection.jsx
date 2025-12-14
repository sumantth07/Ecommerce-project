'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hideHero, setHideHero] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    setHideHero(true)
    setTimeout(() => {
      navigate('/homepage')
    }, 700)
  }

  return (
    <div className="bg-white dark:bg-slate-950">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center gap-2">
            
            <span className="text-sm font-bold text-slate-900 dark:text-white">sumantth kona</span>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Welcome to Ecommerce
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-900 dark:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white dark:bg-slate-900 p-6 sm:max-w-sm border-l border-slate-200 dark:border-slate-700/40">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* HERO SECTION */}
      <div
        className={`
          relative isolate px-6 pt-20 lg:px-8
          bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900
          transition-all duration-700 ease-in-out
          ${hideHero ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <div className="mx-auto max-w-2xl py-16 sm:py-20 lg:py-24 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 border border-emerald-200 dark:border-emerald-700/40">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✨ Now Open
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Everything You Need,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              One Click Away
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover top-quality products, unbeatable prices, and lightning-fast delivery.
            Shop the latest trends and essentials — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={handleGetStarted}
              className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/ cursor-pointer"
            >
              Shop Now
            </button>
            
          </div>

          {/* Stats */}
          
        </div>
      </div>
    </div>
  )
}
