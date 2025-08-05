import React, { useState, useRef, useEffect } from 'react';
import { Upload, TrendingUp, TrendingDown, Target, FileText, Zap, Copy, CheckCircle } from 'lucide-react';


interface Overlay {
  id: number;
  type: string;
  x: number;
  y: number;
  label: string;
  description: string;
  date: string;
  group: string;
}

interface GroupData {
  description: string;
  signals: Overlay[];
}

interface GroupedOverlays {
  [key: string]: GroupData;
}

interface MarkerButtonProps {
  type: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}
const CandlestickOverlayAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('buy');
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [groupedOverlays, setGroupedOverlays] = useState<GroupedOverlays>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const promptTextRef = useRef<HTMLTextAreaElement>(null);

  // Updated example with grouped analysis
  const exampleAnalysis = `CANDLESTICK_ANALYSIS:

GROUP: EARLY_RALLY_PHASE
PHASE_DESCRIPTION: Initial uptrend and first resistance test (April-May)
BUY_SIGNAL: x=8, y=35, label="Early Rally Buy", description="Breakout above 212 resistance with volume", date="Apr 29 - May 6"
BUY_SIGNAL: x=18, y=25, label="Major Breakout", description="Explosive move 214→219, strong bullish engulfing", date="2-3 bars after May 13"
SELL_SIGNAL: x=25, y=30, label="Take Profit Zone", description="Resistance rejection at 219-220 level", date="Around May 20"
RESISTANCE_LEVEL: x=20, y=18, label="First Resistance", description="219-220 level, multiple rejections", date="May 15-20 period"

GROUP: CONSOLIDATION_PHASE
PHASE_DESCRIPTION: Pullback and support formation (Late May-Early June)
SUPPORT_LEVEL: x=30, y=40, label="Pullback Support", description="215-216 area holds, previous resistance becomes support", date="May 28 area"
BUY_SIGNAL: x=35, y=25, label="Second Rally Attempt", description="Breaking above 218 with volume confirmation", date="2-3 bars after Jun 4"

GROUP: FAILURE_PHASE
PHASE_DESCRIPTION: Major reversal and breakdown (Mid June)
SELL_SIGNAL: x=45, y=20, label="Failed Breakout", description="Major reversal from 220, shooting star pattern", date="Around Jun 11"
RESISTANCE_LEVEL: x=45, y=15, label="Major Resistance", description="220 level proves too strong, heavy selling", date="Jun 11 peak"
SELL_SIGNAL: x=50, y=35, label="Breakdown Confirmation", description="Close below 215 support, trend break", date="Mid-June decline"

GROUP: RECOVERY_PHASE
PHASE_DESCRIPTION: Support hold and new rally (Late June-July)
SUPPORT_LEVEL: x=55, y=70, label="Key Support", description="210 level holds strong, multiple hammer patterns", date="Jun 26 - Jul 5"
BUY_SIGNAL: x=58, y=65, label="Recovery Buy", description="Bullish engulfing pattern off 210 support", date="2-3 bars after Jun 26"
BUY_SIGNAL: x=65, y=45, label="Momentum Buy", description="Break above 215, reclaiming previous support", date="Early July"

GROUP: CURRENT_PHASE
PHASE_DESCRIPTION: Testing new resistance levels (Recent)
BUY_SIGNAL: x=75, y=30, label="Breakout Buy", description="Push above 220 resistance, volume expansion", date="Jul 11 onwards"
RESISTANCE_LEVEL: x=85, y=12, label="Current Resistance", description="224-225 area, testing new highs", date="Jul 18 current"
SUPPORT_LEVEL: x=75, y=25, label="New Support", description="220 level now support, role reversal", date="Current level"

GROUP: VOLUME_CONFIRMATION
PHASE_DESCRIPTION: Volume analysis and confirmation signals
BUY_SIGNAL: x=18, y=80, label="Volume Breakout", description="High volume bar confirms major breakout", date="May 15 area volume"
SELL_SIGNAL: x=45, y=85, label="Volume Selling", description="Heavy volume on breakdown, distribution", date="Jun 11 volume spike"
BUY_SIGNAL: x=58, y=90, label="Volume Recovery", description="Increasing volume on bounce from support", date="Late June volume"`;

  const llmPrompt = `Please analyze this candlestick chart and provide buy/sell signals organized in logical groups using this EXACT format:

CANDLESTICK_ANALYSIS:

GROUP: [PHASE_NAME]
PHASE_DESCRIPTION: [Brief description of what's happening in this phase]
BUY_SIGNAL: x=[0-100], y=[0-100], label="[Signal Name]", description="[Technical details]", date="[Time period]"
SELL_SIGNAL: x=[0-100], y=[0-100], label="[Signal Name]", description="[Technical details]", date="[Time period]"
RESISTANCE_LEVEL: x=[0-100], y=[0-100], label="[Level Name]", description="[Technical details]", date="[Time period]"
SUPPORT_LEVEL: x=[0-100], y=[0-100], label="[Level Name]", description="[Technical details]", date="[Time period]"

IMPORTANT INSTRUCTIONS:
• Coordinates: x,y are percentages (0-100) from top-left of image
• x=0 is left edge, x=100 is right edge
• y=0 is top edge, y=100 is bottom edge
• Group similar timeframe signals together
• Typical groups: EARLY_RALLY_PHASE, CONSOLIDATION_PHASE, FAILURE_PHASE, RECOVERY_PHASE, CURRENT_PHASE, VOLUME_CONFIRMATION, BREAKOUT_PHASE, DISTRIBUTION_PHASE
• Look for: breakouts, reversals, support/resistance bounces, volume spikes
• Include 3-6 groups with 2-4 signals each for comprehensive analysis
• Focus on the most significant trading opportunities and key levels

Save your response as a .txt file and upload it to the analyzer.`;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImage(e.target.result as string);
        setOverlays([]);
        setGroupedOverlays({});
        setParseError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysisUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setAnalysisText(e.target.result as string);
        setParseError('');
      };
      reader.readAsText(file);
    }
  };

  const parseLLMAnalysis = (text: string): Overlay[] => {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      const parsedOverlays: Overlay[] = [];
      const groups: GroupedOverlays = {};
      let currentGroup = '';
      let currentPhaseDescription = '';
      let id = 1;

      lines.forEach((line: string) => {
        line = line.trim();
        
        // Skip headers or empty lines
        if (line.startsWith('CANDLESTICK_ANALYSIS:') || !line) return;

        // Parse group headers
        if (line.startsWith('GROUP:')) {
          currentGroup = line.replace('GROUP:', '').trim();
          groups[currentGroup] = {
            description: '',
            signals: []
          };
          return;
        }

        // Parse phase descriptions
        if (line.startsWith('PHASE_DESCRIPTION:')) {
          currentPhaseDescription = line.replace('PHASE_DESCRIPTION:', '').trim();
          if (currentGroup && groups[currentGroup]) {
            groups[currentGroup].description = currentPhaseDescription;
          }
          return;
        }

        // Parse signal types
        let type = '';
        if (line.startsWith('BUY_SIGNAL:')) {
          type = 'buy';
          line = line.replace('BUY_SIGNAL:', '').trim();
        } else if (line.startsWith('SELL_SIGNAL:')) {
          type = 'sell';
          line = line.replace('SELL_SIGNAL:', '').trim();
        } else if (line.startsWith('RESISTANCE_LEVEL:')) {
          type = 'resistance';
          line = line.replace('RESISTANCE_LEVEL:', '').trim();
        } else if (line.startsWith('SUPPORT_LEVEL:')) {
          type = 'support';
          line = line.replace('SUPPORT_LEVEL:', '').trim();
        } else {
          return; // Skip unrecognized lines
        }

        // Parse parameters using regex
        const xMatch = line.match(/x=(\d+(?:\.\d+)?)/);
        const yMatch = line.match(/y=(\d+(?:\.\d+)?)/);
        const labelMatch = line.match(/label="([^"]+)"/);
        const descMatch = line.match(/description="([^"]+)"/);
        const dateMatch = line.match(/date="([^"]+)"/);

        if (xMatch && yMatch) {
          const signal = {
            id: id++,
            type: type,
            x: parseFloat(xMatch[1]),
            y: parseFloat(yMatch[1]),
            label: labelMatch ? labelMatch[1] : `${type.toUpperCase()} Signal`,
            description: descMatch ? descMatch[1] : 'LLM Analysis',
            date: dateMatch ? dateMatch[1] : 'Auto-detected',
            group: currentGroup
          };
          
          parsedOverlays.push(signal);
          
          if (currentGroup && groups[currentGroup]) {
            groups[currentGroup].signals.push(signal);
          }
        }
      });

      setGroupedOverlays(groups);
      return parsedOverlays;
    } catch (error) {
      throw new Error(`Parsing failed: ${(error as Error).message}`);
    }
  };

  const processLLMAnalysis = () => {
    try {
      setParseError('');
      const parsedOverlays = parseLLMAnalysis(analysisText);
      
      if (parsedOverlays.length === 0) {
        throw new Error('No valid signals found in analysis text');
      }
      
      setOverlays(parsedOverlays);
      setShowAnalysis(true);
    } catch (error) {
      setParseError((error as Error).message);
    }
  };

  const loadExampleAnalysis = () => {
    setAnalysisText(exampleAnalysis);
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(llmPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;

    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    const xPercent = (x / canvas.width) * 100;
    const yPercent = (y / canvas.height) * 100;

    const newOverlay = {
      id: Date.now(),
      type: selectedTool,
      x: xPercent,
      y: yPercent,
      label: `${selectedTool.toUpperCase()} Signal`,
      description: 'User added marker',
      date: 'Manual',
      group: 'MANUAL'
    };

    setOverlays([...overlays, newOverlay]);
  };

  const clearAll = () => {
    setOverlays([]);
    setGroupedOverlays({});
    setShowAnalysis(false);
    setAnalysisText('');
    setParseError('');
  };

  const removeOverlay = (id: number) => {
    setOverlays(overlays.filter(overlay => overlay.id !== id));
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Draw overlays
        overlays.forEach((overlay: Overlay) => {
          const x = (overlay.x / 100) * canvas.width;
          const y = (overlay.y / 100) * canvas.height;
          
          ctx.save();
          
          // Draw marker based on type
          if (overlay.type === 'buy') {
            ctx.fillStyle = '#10B981';
            ctx.strokeStyle = '#065F46';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(x, y - 15);
            ctx.lineTo(x - 8, y - 5);
            ctx.lineTo(x - 4, y - 5);
            ctx.lineTo(x - 4, y + 5);
            ctx.lineTo(x + 4, y + 5);
            ctx.lineTo(x + 4, y - 5);
            ctx.lineTo(x + 8, y - 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BUY', x, y + 1);
            
          } else if (overlay.type === 'sell') {
            ctx.fillStyle = '#EF4444';
            ctx.strokeStyle = '#7F1D1D';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x - 8, y + 5);
            ctx.lineTo(x - 4, y + 5);
            ctx.lineTo(x - 4, y - 5);
            ctx.lineTo(x + 4, y - 5);
            ctx.lineTo(x + 4, y + 5);
            ctx.lineTo(x + 8, y + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SELL', x, y + 1);
            
          } else if (overlay.type === 'resistance' || overlay.type === 'support') {
            const color = overlay.type === 'resistance' ? '#F59E0B' : '#8B5CF6';
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            
            ctx.fillStyle = color;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.setLineDash([]);
            ctx.fillText(overlay.type.toUpperCase(), x + 10, y - 5);
          }
          
          ctx.restore();
        });
      };
      
      img.src = image;
    }
  }, [image, overlays]);

  const MarkerButton: React.FC<MarkerButtonProps> = ({ type, icon: Icon, label, active }) => (
    <button
      onClick={() => setSelectedTool(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
        active 
          ? 'bg-blue-100 border-blue-500 text-blue-700' 
          : 'bg-white border-gray-300 hover:bg-gray-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 Automated Candlestick Chart Analyzer
        </h1>
        <p className="text-gray-600 mb-6">
          <strong>Workflow:</strong> 1) Copy LLM prompt → 2) Upload chart → 3) Upload analysis → 4) Get overlays
        </p>
        {/* Step 1 - LLM Instructions - Always visible */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧠 Step 1: LLM Instructions for Chart Analysis</h3>
          <div className="space-y-4">
            <p className="text-yellow-700">Copy the prompt below and use it with your favorite LLM (ChatGPT, Claude, etc.):</p>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-yellow-800">LLM Instructions (Copy this entire prompt):</p>
                <button
                  onClick={copyPromptToClipboard}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 transition-colors text-sm"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>
              <textarea
                ref={promptTextRef}
                value={llmPrompt}
                readOnly
                className="w-full h-64 p-3 text-xs font-mono bg-white border border-yellow-300 rounded resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            
            <div className="p-3 bg-yellow-100 rounded">
              <p className="font-semibold text-yellow-800 mb-2">Usage Instructions:</p>
              <ol className="list-decimal list-inside text-yellow-700 text-sm space-y-1">
                <li>Copy the entire prompt above using the Copy button</li>
                <li>Go to ChatGPT, Claude, or any other LLM</li>
                <li>Upload your candlestick chart image to the LLM</li>
                <li>Paste the copied prompt and submit</li>
                <li>Save the LLM's response as a .txt file</li>
                <li>Then upload both your chart and the .txt file below</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Key Benefits of Grouped Analysis:</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Logical Organization:</strong> Signals are grouped by market phases (Rally, Consolidation, Failure, Recovery, etc.)</p>
            <p><strong>Better Context:</strong> Each group has a description explaining what's happening in that phase</p>
            <p><strong>Complete Story:</strong> Shows the full narrative of price action from start to current</p>
            <p><strong>Strategic Trading:</strong> Helps identify which phase the market is in for better decision making</p>
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="font-semibold text-blue-800">Example Groups:</p>
              <p className="text-blue-700">EARLY_RALLY_PHASE → CONSOLIDATION_PHASE → FAILURE_PHASE → RECOVERY_PHASE → CURRENT_PHASE</p>
            </div>
          </div>
        </div>
        
        {/* Upload Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Step 2: Upload Chart Image</h3>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Upload candlestick chart</p>
                <p className="text-xs text-gray-500">JPEG, PNG supported</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Analysis Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">🤖 Step 3: Upload LLM Analysis</h3>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-6 h-6 mb-2 text-green-500" />
                <p className="text-sm text-green-600">Upload LLM analysis file</p>
                <p className="text-xs text-green-500">TXT file with grouped signals</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleAnalysisUpload}
              />
            </label>
          </div>
        </div>

        {/* Process Button */}
        {analysisText && image && (
          <div className="mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Step 4: Ready to Generate Overlays</h3>
              <p className="text-green-700 text-sm mb-3">Both chart and grouped analysis are uploaded. Click below to automatically generate organized buy/sell overlays!</p>
            </div>
            <button
              onClick={processLLMAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Zap size={20} />
              🚀 Process Grouped LLM Analysis & Generate Overlays
            </button>
            {parseError && (
              <p className="text-red-600 text-sm mt-2">❌ {parseError}</p>
            )}
          </div>
        )}

        {image && (
          <>
            {/* Manual Tools (Optional) */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Manual Tools (Optional):</h3>
              <div className="flex gap-3 flex-wrap">
                <MarkerButton
                  type="buy"
                  icon={TrendingUp}
                  label="Buy Signal"
                  active={selectedTool === 'buy'}
                />
                <MarkerButton
                  type="sell"
                  icon={TrendingDown}
                  label="Sell Signal"
                  active={selectedTool === 'sell'}
                />
                <MarkerButton
                  type="resistance"
                  icon={Target}
                  label="Support/Resistance"
                  active={selectedTool === 'resistance'}
                />
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-w-full h-auto border border-gray-300 rounded-lg cursor-crosshair shadow-md"
                style={{ maxHeight: '600px' }}
              />
            </div>

            {/* Grouped Analysis Results */}
            {Object.keys(groupedOverlays).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  📊 Grouped Analysis Results ({overlays.length} total signals)
                </h3>
                
                {Object.entries(groupedOverlays).map(([groupName, groupData]) => (
                  <div key={groupName} className="mb-4 p-4 bg-white rounded-lg border">
                    <div className="mb-3">
                      <h4 className="font-bold text-gray-800 text-lg">{groupName.replace(/_/g, ' ')}</h4>
                      <p className="text-gray-600 text-sm italic">{groupData.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {groupData.signals.map((signal: Overlay) => (
                        <div
                          key={signal.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              signal.type === 'buy' ? 'bg-green-500' :
                              signal.type === 'sell' ? 'bg-red-500' : 
                              signal.type === 'resistance' ? 'bg-orange-500' : 'bg-purple-500'
                            }`}></div>
                            <div>
                              <span className="font-semibold text-gray-800">
                                {signal.label}
                              </span>
                              <p className="text-sm text-gray-600">
                                {signal.description} • {signal.date}
                              </p>
                              <p className="text-xs text-gray-500">
                                Position: {signal.x.toFixed(1)}%, {signal.y.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeOverlay(signal.id)}
                            className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Regular Analysis Results (for manual or ungrouped signals) */}
            {overlays.length > 0 && Object.keys(groupedOverlays).length === 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  📊 Analysis Results ({overlays.length} signals detected)
                </h3>
                <div className="space-y-2">
                  {overlays.map((overlay: Overlay) => (
                    <div
                      key={overlay.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          overlay.type === 'buy' ? 'bg-green-500' :
                          overlay.type === 'sell' ? 'bg-red-500' : 
                          overlay.type === 'resistance' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}></div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            {overlay.label}
                          </span>
                          <p className="text-sm text-gray-600">
                            {overlay.description} • {overlay.date}
                          </p>
                          <p className="text-xs text-gray-500">
                            Position: {overlay.x.toFixed(1)}%, {overlay.y.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeOverlay(overlay.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandlestickOverlayAnalyzer;