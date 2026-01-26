import { useState, useEffect, useCallback } from 'react'

function App() {
  const [array, setArray] = useState([])
  const [isSorting, setIsSorting] = useState(false)
  const [algorithm, setAlgorithm] = useState('bubble')
  const [speed, setSpeed] = useState(100)

  useEffect(() => {
    generateArray()
  }, [])

  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10)
    setArray(newArray)
    setIsSorting(false)
  }, [])

  // All sorting functions (keep exactly same as before)
  const bubbleSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        setArray([...arr])
        await new Promise(resolve => setTimeout(resolve, speed))
      }
    }
    setIsSorting(false)
  }

  const mergeSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    await mergeSortHelper(arr, 0, arr.length - 1)
    setArray(arr)
    setIsSorting(false)
  }

  const mergeSortHelper = async (arr, start, end) => {
    if (start >= end) return
    const mid = Math.floor((start + end) / 2)
    await mergeSortHelper(arr, start, mid)
    await mergeSortHelper(arr, mid + 1, end)
    await mergeHelper(arr, start, mid, end)
  }

  const mergeHelper = async (arr, start, mid, end) => {
    const left = arr.slice(start, mid + 1)
    const right = arr.slice(mid + 1, end + 1)
    let i = 0, j = 0, k = start
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) arr[k++] = left[i++]
      else arr[k++] = right[j++]
      setArray([...arr])
      await new Promise(resolve => setTimeout(resolve, speed))
    }
  }

  const quickSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    await quickSortHelper(arr, 0, arr.length - 1)
    setArray(arr)
    setIsSorting(false)
  }

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pi = await partition(arr, low, high)
      await quickSortHelper(arr, low, pi - 1)
      await quickSortHelper(arr, pi + 1, high)
    }
  }

  const partition = async (arr, low, high) => {
    const pivot = arr[high]
    let i = low - 1
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        setArray([...arr])
        await new Promise(resolve => setTimeout(resolve, speed))
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    setArray([...arr])
    return i + 1
  }

  const startSorting = async () => {
    if (isSorting || array.length === 0) return
    switch (algorithm) {
      case 'bubble': await bubbleSort(); break
      case 'merge': await mergeSort(); break
      case 'quick': await quickSort(); break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce-slower"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Container - PERFECT CENTER */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">

        {/* BOLD PROFESSIONAL HEADING */}
        <div className="group">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text drop-shadow-2xl shadow-white/50 mb-4 tracking-tight">
            DSA Visualizer
          </h1>
          <div className="w-48 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto rounded-full shadow-lg transform group-hover:scale-x-110 transition-all duration-500"></div>
          <p className="text-xl md:text-2xl text-gray-300 font-medium mt-4">Bubble • Merge • Quick Sort Algorithms</p>
        </div>

        {/* Controls - Professional Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-3xl">
          {/* Algorithm Selector */}
          <div className="group">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isSorting}
              className="w-full p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-xl font-bold text-white shadow-xl hover:shadow-2xl hover:border-white/40 transition-all duration-500 group-hover:scale-[1.02] focus:scale-[1.02] disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              <option value="bubble">Bubble Sort O(n²)</option>
              <option value="merge">Merge Sort O(n log n)</option>
              <option value="quick">Quick Sort O(n log n)</option>
            </select>
          </div>

          {/* Speed Control */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
            <label className="block text-white/80 font-semibold text-lg mb-4 uppercase tracking-wider">Speed</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50" max="300"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isSorting}
                className="flex-1 h-2 bg-white/30 rounded-xl cursor-pointer accent-blue-400 shadow-inner hover:shadow-inner-lg transition-all appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <span className="text-2xl font-bold text-white bg-black/30 px-3 py-1 rounded-xl shadow-md min-w-[60px]">
                {speed}ms
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="space-y-3 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
                <span>Unsorted</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-400 rounded-full shadow-lg animate-pulse"></div>
                <span>Sorted</span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <button
            onClick={generateArray}
            disabled={isSorting}
            className="flex-1 h-16 bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:animate-spin">🎲</span>
            New Array
          </button>

          <button
            onClick={startSorting}
            disabled={isSorting || array.length === 0}
            className="flex-1 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 backdrop-blur-xl border-2 border-white/30 rounded-2xl text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <span className="text-2xl">{isSorting ? '🔄' : '▶️'}</span>
            {isSorting ? 'Sorting...' : 'Visualize'}
          </button>
        </div>

        {/* VISUALIZATION CANVAS - FULL WIDTH CENTER */}
        <div className="w-full max-w-6xl bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-12 shadow-2xl mt-16 mb-20">
          <div className="flex items-end justify-center gap-2 h-[400px] px-4">
            {array.map((value, index) => (
              <div
                key={index}
                className="w-12 transition-all duration-500 hover:scale-110 group flex flex-col-reverse items-center rounded-2xl shadow-xl relative overflow-hidden hover:shadow-2xl hover:z-10"
                style={{ height: `${value * 6}px` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 via-purple-500 to-emerald-500 rounded-2xl shadow-lg group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-emerald-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-4 group-hover:translate-x-8 transition-transform duration-700"></div>
                <span className="text-sm font-bold text-white/95 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-xl mt-3 shadow-lg relative z-10">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="text-4xl font-black text-blue-400 mb-3">Day 26</div>
            <div className="text-xl text-white/80 font-bold">Production Ready</div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">3 Algorithms</div>
            <div className="text-white/90 font-bold">Live Visualization</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="text-4xl font-black text-purple-400 mb-3">2026</div>
            <div className="text-xl text-white/80 font-bold">Design Standard</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        @keyframes bounce-slower {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.08); }
        }
        .animate-bounce-slow { animation: bounce-slow 25s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slower 30s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default App
