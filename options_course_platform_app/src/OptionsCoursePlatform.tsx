import React, { useState } from 'react';
import CandlestickOverlayAnalyzer from './candlestick_overlay_analyzer';

const OptionsCoursePlatform = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [studentName, setStudentName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountSize, setAccountSize] = useState(100000);
  const [monthlyGoal, setMonthlyGoal] = useState(3);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [marketData, setMarketData] = useState({
    price: 6264.75,
    change: 15.25,
    changePercent: 0.24,
    open: 6249.50,
    high: 6278.25,
    low: 6245.00,
    volume: 142.5
  });

  // Text-to-Speech function with female voice
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 0.7;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Karen') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Susan')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulate live market data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const priceChange = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(6200, Math.min(6300, prev.price + priceChange));
        const newChange = newPrice - 6249.50;
        const newChangePercent = (newChange / 6249.50) * 100;
        const newHigh = Math.max(prev.high, newPrice);
        const newLow = Math.min(prev.low, newPrice);
        const volumeChange = Math.random() * 2 - 1;
        const newVolume = Math.max(140, prev.volume + volumeChange);
        
        return {
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2)),
          open: 6249.50,
          high: parseFloat(newHigh.toFixed(2)),
          low: parseFloat(newLow.toFixed(2)),
          volume: parseFloat(newVolume.toFixed(1))
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        speak("Welcome to the Options Income Course platform. Learn systematic strategies for generating income through options writing with controlled risk management on ES futures contracts.");
      }, 1000);
    }
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    speak("Signing you in to the Options Income Course platform");
    const name = email.split('@')[0] || 'Student';
    setStudentName(name.charAt(0).toUpperCase() + name.slice(1));
    setTimeout(() => {
      setCurrentPage('welcome');
      speak(`Welcome back ${name.charAt(0).toUpperCase() + name.slice(1)}! Your dashboard shows 75% course progress, 87% success rate, and 2,340 dollars in total income generated.`);
    }, 800);
  };

  const calculateDailyTarget = () => {
    return ((accountSize * monthlyGoal / 100) / 21).toFixed(2);
  };

  // Voice descriptions for tab content
  const getTabDescription = (tabId: string) => {
    const descriptions: Record<string, string> = {
      'overview': 'Course overview covering systematic income generation through options writing, prerequisites including Tier 3 trading privileges and 100,000 dollar account minimum, and key concepts of maximum gain and risk management.',
      'calculator': 'Income calculator to determine your daily, monthly, and annual profit targets based on account size and percentage goals. Calculate how much you need to earn per trading day to meet your income objectives.',
      'strategy': 'Trading strategy section with market analysis checklist, strike price selection process, and step-by-step instructions for identifying profitable option writing opportunities on ES futures.',
      'tradeanalyzer': 'Trade Analyzer section featuring advanced candlestick chart analysis with AI-powered signal detection. Upload chart images and LLM analysis to automatically generate buy/sell signals, support/resistance levels, and grouped trading phase insights.',
      'risk': 'Risk management fundamentals including the three critical rules: the 50 percent rule for early position closure, break-even rule for cutting losses, and AI monitoring for real-time threat detection.',
      'appendices': 'Reference materials covering ES futures contract specifications, trading hours, tick values, and Tier 3 options trading privilege requirements for advanced strategies.'
    };
    return descriptions[tabId] || 'Course content section';
  };

  // Login Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Options Income Course Platform</h1>
            <p className="text-purple-300">Generate Income with Controlled Risk</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-purple-200 mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg pl-10 pr-12 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      speak(showPassword ? "Password hidden" : "Password visible");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
              >
                Sign In
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-purple-300 hover:text-purple-200 text-sm">Forgot your password?</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Page
  if (currentPage === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 relative z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Options Income Course Platform</h1>
                  <p className="text-purple-300 text-sm">Student Portal</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 relative z-[1000]">
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full" style={{
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                  <span className="text-green-300 text-sm">ES Market Open</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white">{studentName}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{studentName}!</span>
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Ready to master income generation through options trading? Let's continue your journey to financial success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 text-center">
              <svg className="w-8 h-8 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
              <h3 className="text-white font-semibold mb-1">Course Progress</h3>
              <p className="text-2xl font-bold text-blue-400">75%</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 text-center">
              <svg className="w-8 h-8 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-white font-semibold mb-1">Success Rate</h3>
              <p className="text-2xl font-bold text-yellow-400">87%</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 text-center">
              <svg className="w-8 h-8 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 className="text-white font-semibold mb-1">Total Income</h3>
              <p className="text-2xl font-bold text-green-400">$2,340</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 text-center">
              <svg className="w-8 h-8 text-purple-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-white font-semibold mb-1">Days Active</h3>
              <p className="text-2xl font-bold text-purple-400">23</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">Continue Learning</h3>
              <p className="text-purple-200 mb-6">
                Pick up where you left off and master the art of options income generation.
              </p>
              <button
                onClick={() => {
                  speak("Entering the main course. You will learn systematic options writing strategies, risk management, and income generation techniques using ES futures contracts.");
                  setCurrentPage('course');
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
              >
                Enter Course
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">Today's Market</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">ES Futures:</span>
                  <span className="text-green-400 font-semibold">6,264.75 (+0.24%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">VIX:</span>
                  <span className="text-yellow-400 font-semibold">18.42 (-2.1%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Market Status:</span>
                  <span className="text-green-400 font-semibold">Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Page
  return (
    <div className="min-h-screen bg-slate-900">
      {/* ES Mini Ticker */}
      <div className="bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-purple-300">ES Mini:</span>
                <span className={`font-semibold transition-colors duration-300 ${
                  marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketData.price.toFixed(2)}
                </span>
                <span className={`transition-colors duration-300 ${
                  marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%)
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {[4, 3, 5, 2, 4, 6, 3, 4].map((height, index) => (
                    <div 
                      key={index}
                      className={`w-1 rounded-sm ${index === 3 ? 'bg-red-400' : 'bg-green-400'}`}
                      style={{
                        height: `${height * 4}px`,
                        animation: 'bounce 2s infinite',
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-purple-300">Open: <span className="text-white transition-all duration-500">{marketData.open.toFixed(2)}</span></span>
                <span className="text-purple-300">High: <span className="text-green-300 transition-all duration-500">{marketData.high.toFixed(2)}</span></span>
                <span className="text-purple-300">Low: <span className="text-red-300 transition-all duration-500">{marketData.low.toFixed(2)}</span></span>
                <span className="text-purple-300">Vol: <span className="text-blue-300 transition-all duration-500">{marketData.volume.toFixed(1)}K</span></span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" style={{
                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span className="text-green-300 text-xs">Live Data</span>
              <span className="text-purple-300 text-xs">Last: {new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                timeZone: 'America/New_York' 
              })} EST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  speak("Returning to welcome page");
                  setCurrentPage('welcome');
                }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Options Income Course Platform</h1>
                <p className="text-purple-300 text-sm">Generate Income with Controlled Risk</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 relative z-[1000]">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full" style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <span className="text-green-300 text-sm">ES Market Open</span>
              </div>
              <div className="flex items-center space-x-2 relative">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <button 
                  onClick={() => {
                    speak(showUserMenu ? "Closing user menu" : "Opening user menu");
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors"
                >
                  <span>{studentName}</span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 rounded-xl border border-purple-500/20 shadow-2xl z-[100]">
                    <div className="p-4 border-b border-purple-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{studentName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{studentName}</p>
                          <p className="text-purple-300 text-sm">Premium Student</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          speak("Account settings where you can update your personal information, trading preferences, and subscription details");
                          alert('Account settings would open here');
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-purple-100 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Account</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          speak("Logging out. Goodbye!");
                          setCurrentPage('login');
                          setStudentName('');
                          setEmail('');
                          setPassword('');
                          setTimeout(() => {
                            alert('You have been logged out successfully');
                          }, 500);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-purple-500/20">
            <div className="flex items-center justify-start gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Course Overview', activeClass: 'from-purple-500 to-pink-500' },
                { id: 'calculator', label: 'Income Calculator', activeClass: 'from-emerald-500 to-teal-500' },
                { id: 'strategy', label: 'Trading Strategy', activeClass: 'from-blue-500 to-indigo-500' },
                { id: 'tradeanalyzer', label: 'Trade Analyzer', activeClass: 'from-cyan-500 to-blue-500' },
                { id: 'risk', label: 'Risk Management', activeClass: 'from-violet-500 to-purple-500' },
                { id: 'appendices', label: 'Reference Materials', activeClass: 'from-amber-500 to-orange-500' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    speak(getTabDescription(tab.id));
                    setActiveTab(tab.id);
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.activeClass} text-white shadow-lg`
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 relative z-10">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Course Objective</h2>
              </div>
              <p className="text-purple-100 text-lg leading-relaxed mb-6">
                This course provides a systematic approach to generating income through options writing 
                while maintaining disciplined risk management practices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Maximum Gain</h4>
                  <p className="text-purple-200 text-sm">Premium received when option expires worthless</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Underlying Asset</h4>
                  <p className="text-blue-200 text-sm">ES Futures Contracts (E-mini S&P 500)</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-white/5 rounded-lg">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-purple-100">Tier 3 Options Trading Privileges</span>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-lg">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-purple-100">$100,000 minimum account value</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div>
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Income Calculator</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-purple-200 mb-2">Account Size ($)</label>
                  <input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(Number(e.target.value))}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200 mb-2">Monthly Goal (%)</label>
                  <select
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value={1} className="bg-slate-800">1%</option>
                    <option value={2} className="bg-slate-800">2%</option>
                    <option value={3} className="bg-slate-800">3%</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl text-center">
                  <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h4 className="text-white font-semibold">Daily Target</h4>
                  <p className="text-2xl font-bold text-green-400">${calculateDailyTarget()}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl text-center">
                  <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h4 className="text-white font-semibold">Monthly Target</h4>
                  <p className="text-2xl font-bold text-blue-400">${(accountSize * monthlyGoal / 100).toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl text-center">
                  <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-white font-semibold">Annual Target</h4>
                  <p className="text-2xl font-bold text-purple-400">{(monthlyGoal * 12)}%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Market Analysis Checklist</h2>
              
              <div className="space-y-4">
                {[
                  'Is the ES in an upward move?',
                  'What is the current market price?',
                  'What was the previous day\'s close price?',
                  'What is the current open market price?'
                ].map((question, index) => (
                  <div key={index} className="flex items-center p-4 bg-white/5 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-purple-500 rounded mr-4" />
                    <span className="text-purple-100">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tradeanalyzer' && (
            <CandlestickOverlayAnalyzer />
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Three Risk Reduction Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-b from-red-500/20 to-red-600/20 p-6 rounded-xl">
                  <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">1</div>
                  <h4 className="text-white font-semibold mb-3 text-center">50% Rule</h4>
                  <p className="text-red-100 text-sm text-center">
                    If buyback cost is half of max gain, close position immediately
                  </p>
                </div>
                
                <div className="bg-gradient-to-b from-orange-500/20 to-orange-600/20 p-6 rounded-xl">
                  <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">2</div>
                  <h4 className="text-white font-semibold mb-3 text-center">Break-Even Rule</h4>
                  <p className="text-orange-100 text-sm text-center">
                    If buyback cost equals max gain, close immediately
                  </p>
                </div>
                
                <div className="bg-gradient-to-b from-blue-500/20 to-blue-600/20 p-6 rounded-xl">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">3</div>
                  <h4 className="text-white font-semibold mb-3 text-center">AI Monitoring</h4>
                  <p className="text-blue-100 text-sm text-center">
                    Use Pro Coach for real-time threat alerts
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appendices' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Reference Materials</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl">
                  <h4 className="text-white font-semibold mb-3">Appendix A: ES Futures Contracts</h4>
                  <p className="text-blue-100 text-sm mb-4">
                    Complete guide to E-mini S&P 500 futures contracts and specifications.
                  </p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl">
                  <h4 className="text-white font-semibold mb-3">Appendix B: Tier 3 Privileges</h4>
                  <p className="text-purple-100 text-sm mb-4">
                    Requirements for Level 3 options trading authorization.
                  </p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsCoursePlatform;