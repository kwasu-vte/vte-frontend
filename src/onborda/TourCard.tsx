'use client'
import React from 'react'
import type { CardComponentProps } from 'onborda'
import { useOnborda } from 'onborda'

export const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const { closeOnborda } = useOnborda()

  return (
    <div className="rounded-md bg-white p-4 shadow w-[calc(100vw-2rem)] max-w-sm md:max-w-md lg:max-w-lg">
      <p className="text-sm text-neutral-500">{currentStep + 1} of {totalSteps}</p>
      <p className="mt-1 text-lg font-semibold flex items-center gap-2">
        <span>{step.icon}</span> {step.title}
      </p>
      <div className="mt-2 text-neutral-700">{step.content}</div>

      <div className="mt-4 flex items-center gap-2">
        {currentStep !== 0 && (
          <button className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200" onClick={prevStep}>Previous</button>
        )}
        {currentStep + 1 !== totalSteps && (
          <button className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary-600" onClick={nextStep}>Next</button>
        )}
        {currentStep + 1 === totalSteps && (
          <button className="px-3 py-1 rounded-md bg-success text-white hover:bg-green-600" onClick={() => closeOnborda()}>Finish</button>
        )}
        <button className="ml-auto text-sm text-neutral-500" onClick={() => closeOnborda()}>Close</button>
      </div>
      <span className="sr-only">{arrow}</span>
    </div>
  )
}


