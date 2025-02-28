"use client"

import { useRef, useState, useEffect } from "react"

export default function PinInput({ length, onChange, value }) {
  const [pins, setPins] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  useEffect(() => {
    if (value) {
      const valueArray = value.split("").slice(0, length)
      setPins(valueArray.concat(Array(length - valueArray.length).fill("")))
    }
  }, [value, length])

  useEffect(() => {
    onChange(pins.join(""))
  }, [pins, onChange])

  const handleChange = (index, e) => {
    const val = e.target.value
    if (val === "" || /^\d$/.test(val)) {
      const newPins = [...pins]
      newPins[index] = val.slice(-1)
      setPins(newPins)

      if (val !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pins[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.split("").slice(0, length)
      const newPins = [...pastedArray, ...Array(length - pastedArray.length).fill("")]
      setPins(newPins.slice(0, length))

      const nextEmptyIndex = pastedArray.length < length ? pastedArray.length : length - 1
      inputRefs.current[nextEmptyIndex]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-4 my-6">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={pins[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-2xl text-center border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            aria-label={`Dígito ${index + 1}`}
          />
        </div>
      ))}
    </div>
  )
}

