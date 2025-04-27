'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const steps = ['Clinical Signs', 'Flock History', 'Review']

const clinicalOptions = [
  { value: 'decreased_feed', label: 'Decreased feed intake' },
  { value: 'drooping_wings', label: 'Drooping wings' },
  { value: 'pale_comb', label: 'Pale comb' },
  { value: 'diarrhea', label: 'Diarrhea' },
  { value: 'none', label: 'None of the above' },
]

const ageGroups = [
  { value: '<20', label: 'Under 20 weeks' },
  { value: '20-30', label: '20–30 weeks' },
  { value: '>30', label: 'Over 30 weeks' },
]

const vaccinationOptions = [
  { value: 'mareks', label: "Marek's disease" },
  { value: 'newcastle', label: 'Newcastle disease' },
  { value: 'bronchitis', label: 'Infectious bronchitis' },
  { value: 'none', label: 'None' },
]

export default function ChickenDiagnosisPage() {
  const [step, setStep] = useState(0)
  const [primarySign, setPrimarySign] = useState('')
  const [secondarySign, setSecondarySign] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [vaccination, setVaccination] = useState('')

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))
  const submit = () => {
    alert(
      `Primary Sign: ${primarySign}\n` +
      `Secondary Sign: ${secondarySign}\n` +
      `Age Group: ${ageGroup}\n` +
      `Vaccination: ${vaccination}`
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Layer Chicken Diagnosis Wizard</h1>

      {/* Wizard indicator */}
      <div className="flex items-center">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full border-2
                ${step === idx
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 text-gray-500'}`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-1 text-sm ${
                step === idx ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="space-y-4">
        {step === 0 && (
          <>
            <Label htmlFor="primarySign">Primary clinical sign</Label>
            <Select value={primarySign} onValueChange={setPrimarySign}>
              <SelectTrigger id="primarySign">
                <SelectValue placeholder="Select sign" />
              </SelectTrigger>
              <SelectContent>
                {clinicalOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="secondarySign">Secondary clinical sign</Label>
            <Select value={secondarySign} onValueChange={setSecondarySign}>
              <SelectTrigger id="secondarySign">
                <SelectValue placeholder="Select sign" />
              </SelectTrigger>
              <SelectContent>
                {clinicalOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {step === 1 && (
          <>
            <Label htmlFor="ageGroup">Age group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger id="ageGroup">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="vaccination">Vaccination status</Label>
            <Select value={vaccination} onValueChange={setVaccination}>
              <SelectTrigger id="vaccination">
                <SelectValue placeholder="Select vaccine" />
              </SelectTrigger>
              <SelectContent>
                {vaccinationOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <p><strong>Primary Sign:</strong> {primarySign || <em>(none)</em>}</p>
            <p><strong>Secondary Sign:</strong> {secondarySign || <em>(none)</em>}</p>
            <p><strong>Age Group:</strong> {ageGroup || <em>(none)</em>}</p>
            <p><strong>Vaccination:</strong> {vaccination || <em>(none)</em>}</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={submit}>Submit</Button>
        )}
      </div>
    </div>
  )
}
