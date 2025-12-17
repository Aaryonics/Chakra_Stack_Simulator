import React, { useState } from 'react';
import { Zap, Heart, Eye, MessageCircle, Sun, Droplet, Anchor, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download } from "lucide-react";

const ChakraStackSimulatorFull = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stack, setStack] = useState([]);
  const [energy, setEnergy] = useState(50);
  const [currentRemedy, setCurrentRemedy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const chakraData = [
    { name: 'Root', color: 'bg-red-500', icon: Anchor, theme: 'Security & Grounding', element: 'Earth' },
    { name: 'Sacral', color: 'bg-orange-500', icon: Droplet, theme: 'Creativity & Pleasure', element: 'Water' },
    { name: 'Solar Plexus', color: 'bg-yellow-500', icon: Sun, theme: 'Confidence & Power', element: 'Fire' },
    { name: 'Heart', color: 'bg-green-500', icon: Heart, theme: 'Love & Compassion', element: 'Air' },
    { name: 'Throat', color: 'bg-blue-500', icon: MessageCircle, theme: 'Communication & Truth', element: 'Sound' },
    { name: 'Third Eye', color: 'bg-indigo-500', icon: Eye, theme: 'Intuition & Insight', element: 'Light' },
    { name: 'Crown', color: 'bg-violet-500', icon: Zap, theme: 'Spiritual Connection', element: 'Consciousness' }
  ];

  const questions = [
    // Root Chakra (0-4)
    { chakra: 0, text: "How secure do you feel about your financial situation?", type: "scale" },
    { chakra: 0, text: "Do you feel safe and stable in your living environment?", type: "scale" },
    { chakra: 0, text: "How connected do you feel to your physical body?", type: "scale" },
    { chakra: 0, text: "Do you trust that your basic needs will be met?", type: "scale" },
    { chakra: 0, text: "How grounded do you feel in your daily life?", type: "scale" },
    
    // Sacral Chakra (5-9)
    { chakra: 1, text: "How comfortable are you expressing your emotions?", type: "scale" },
    { chakra: 1, text: "Do you allow yourself to experience pleasure and joy?", type: "scale" },
    { chakra: 1, text: "How creative do you feel in your daily activities?", type: "scale" },
    { chakra: 1, text: "Are you comfortable with intimacy and connection?", type: "scale" },
    { chakra: 1, text: "How well do you adapt to change?", type: "scale" },
    
    // Solar Plexus (10-14)
    { chakra: 2, text: "How confident do you feel in your abilities?", type: "scale" },
    { chakra: 2, text: "Do you feel in control of your life direction?", type: "scale" },
    { chakra: 2, text: "How comfortable are you making decisions?", type: "scale" },
    { chakra: 2, text: "Do you assert your boundaries with others?", type: "scale" },
    { chakra: 2, text: "How motivated do you feel to pursue your goals?", type: "scale" },
    
    // Heart Chakra (15-19)
    { chakra: 3, text: "How easily do you give and receive love?", type: "scale" },
    { chakra: 3, text: "Do you practice self-compassion regularly?", type: "scale" },
    { chakra: 3, text: "How forgiving are you towards yourself and others?", type: "scale" },
    { chakra: 3, text: "Do you feel connected to those around you?", type: "scale" },
    { chakra: 3, text: "How open is your heart to new relationships?", type: "scale" },
    
    // Throat Chakra (20-24)
    { chakra: 4, text: "How comfortably do you express your truth?", type: "scale" },
    { chakra: 4, text: "Do you feel heard and understood by others?", type: "scale" },
    { chakra: 4, text: "How authentic are you in your communication?", type: "scale" },
    { chakra: 4, text: "Do you speak up when something bothers you?", type: "scale" },
    { chakra: 4, text: "How well do you listen to others?", type: "scale" },
    
    // Third Eye (25-29)
    { chakra: 5, text: "How much do you trust your intuition?", type: "scale" },
    { chakra: 5, text: "Do you have clarity about your life purpose?", type: "scale" },
    { chakra: 5, text: "How vivid is your imagination and visualization?", type: "scale" },
    { chakra: 5, text: "Do you experience meaningful insights or dreams?", type: "scale" },
    { chakra: 5, text: "How connected are you to your inner wisdom?", type: "scale" },
    
    // Crown Chakra (30-34)
    { chakra: 6, text: "How connected do you feel to something greater than yourself?", type: "scale" },
    { chakra: 6, text: "Do you experience moments of spiritual awareness?", type: "scale" },
    { chakra: 6, text: "How much meaning and purpose do you find in life?", type: "scale" },
    { chakra: 6, text: "Do you practice mindfulness or meditation?", type: "scale" },
    { chakra: 6, text: "How open are you to spiritual growth?", type: "scale" }
  ];

  const simulateAIAnalysis = (userAnswers) => {
    const chakraScores = Array(7).fill(0);
    
    questions.forEach((q, idx) => {
      const answer = userAnswers[idx] || 3;
      chakraScores[q.chakra] += answer;
    });

    const chakraResults = chakraData.map((chakra, idx) => {
      const score = chakraScores[idx];
      const avg = score / 5;
      
      let state, effects, sideEffects, remedies;
      
      if (avg >= 4) {
        state = 'overactive';
        effects = [
          `Excessive ${chakra.theme.toLowerCase()} dominating your energy`,
          `Overwhelming feelings related to ${chakra.element.toLowerCase()}`,
          'Difficulty finding balance in this area'
        ];
        sideEffects = [
          'Energy burnout in this center',
          'Compensation in other chakras',
          'Physical or emotional exhaustion'
        ];
        remedies = [
          `Practice grounding exercises to balance ${chakra.name}`,
          'Engage in calming activities and rest',
          `Focus on other chakras to redistribute energy`
        ];
      } else if (avg >= 2.5) {
        state = 'balanced';
        effects = [
          `Healthy ${chakra.theme.toLowerCase()} expression`,
          `Good flow of ${chakra.element.toLowerCase()} energy`,
          'Stable and centered in this area'
        ];
        sideEffects = [];
        remedies = [
          `Maintain current practices for ${chakra.name}`,
          'Continue nurturing this balanced state',
          'Share your balance with others'
        ];
      } else {
        state = 'underactive';
        effects = [
          `Limited ${chakra.theme.toLowerCase()} in daily life`,
          `Blocked ${chakra.element.toLowerCase()} energy flow`,
          'Difficulty accessing this energy center'
        ];
        sideEffects = [
          'Compensating through other chakras',
          'Missing opportunities for growth',
          'Feeling incomplete or unfulfilled'
        ];
        remedies = [
          `Practice ${chakra.name} activation exercises`,
          `Meditate on ${chakra.theme.toLowerCase()}`,
          `Incorporate ${chakra.element.toLowerCase()} elements into daily routine`
        ];
      }

      return { ...chakra, state, score: avg, effects, sideEffects, remedies };
    });

    return {
      chakras: chakraResults,
      overallBalance: chakraScores.reduce((a, b) => a + b, 0) / 35,
      timestamp: new Date().toISOString()
    };
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuestionnaire();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuestionnaire = () => {
    setLoading(true);
    setTimeout(() => {
      const result = simulateAIAnalysis(answers);
      setAnalysisResult(result);
      setCurrentScreen('results');
      setLoading(false);
    }, 2000);
  };

  const downloadResultsAsPDF = async () => {
  try {
    // Show loading message
    setMessage('Generating PDF... Please wait');
    
    // Get the results container element
    const resultsElement = document.getElementById('results-container');
    
    if (!resultsElement) {
      alert('Unable to generate PDF. Please try again.');
      return;
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(resultsElement, {
      scale: 2, // Higher quality
      useCORS: true,
      backgroundColor: '#1e1b4b', // Match gradient background
      logging: false
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Chakra_Analysis_${timestamp}.pdf`;

    // Save PDF
    pdf.save(filename);
    
    setMessage('✅ PDF downloaded successfully!');
    setTimeout(() => setMessage(''), 3000);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
    }
  };

  const pushEmotion = (chakraIndex) => {
    if (energy <= 10) return;
    setStack([...stack, chakraIndex]);
    setEnergy(prev => Math.max(0, prev - 10));
  };

  const popEmotion = () => {
    if (stack.length === 0) return;
    setStack(stack.slice(0, -1));
    setEnergy(prev => Math.min(100, prev + 15));
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Chakra Stack Simulator
            </h1>
            <p className="text-2xl text-violet-300">A Journey Through Your Energy Centers</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur rounded-2xl p-8 border border-violet-500/30">
            <Sparkles className="mx-auto text-violet-400 mb-4" size={48} />
            <p className="text-violet-200 text-lg leading-relaxed mb-6">
              Discover the balance of your seven chakras through 35 thoughtful questions. 
              Using stack operations as a metaphor for emotional flow, we'll analyze your 
              energy centers and provide personalized healing guidance.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left text-sm text-violet-300 mb-6">
              <div>✓ 35 Chakra Questions</div>
              <div>✓ AI-Powered Analysis</div>
              <div>✓ Visual Energy Flow</div>
              <div>✓ Personalized Remedies</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('questionnaire')}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-12 py-4 rounded-xl 
              font-bold text-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg 
              hover:shadow-violet-500/50 hover:scale-105"
          >
            Begin Journey <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Questionnaire Screen
  if (currentScreen === 'questionnaire') {
    const currentQ = questions[currentQuestion];
    const currentChakra = chakraData[currentQ.chakra];
    const Icon = currentChakra.icon;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-violet-300 font-semibold">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={`${currentChakra.color} rounded-xl p-6 mb-8 shadow-xl`}>
            <div className="flex items-center gap-4 text-white">
              <Icon size={40} />
              <div>
                <h3 className="text-2xl font-bold">{currentChakra.name} Chakra</h3>
                <p className="text-white/90">{currentChakra.theme}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur rounded-2xl p-8 border border-violet-500/30 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">{currentQ.text}</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 rounded-lg font-semibold transition-all ${
                    answers[currentQuestion] === value
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white scale-105 shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {value === 1 && '😔 Not at all'}
                  {value === 2 && '😐 Rarely'}
                  {value === 3 && '😊 Sometimes'}
                  {value === 4 && '😄 Often'}
                  {value === 5 && '🌟 Always'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={prevQuestion} disabled={currentQuestion === 0}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowLeft className="inline mr-2" size={20} />Previous
            </button>
            <button onClick={nextQuestion} disabled={answers[currentQuestion] === undefined}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}<ArrowRight className="inline ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin text-violet-400"><Sparkles size={64} /></div>
          <h2 className="text-3xl font-bold text-white">Analyzing Your Energy Centers...</h2>
          <p className="text-violet-300">Processing chakra responses with AI</p>
        </div>
      </div>
    );
  }

  

  /// Results Screen
if (currentScreen === 'results' && analysisResult) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ADD: Results Container with ID for PDF capture */}
        <div id="results-container">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              Your Chakra Analysis
            </h1>
            <p className="text-violet-300 text-lg">
              Overall Balance: {(analysisResult.overallBalance * 20).toFixed(1)}%
            </p>
            {/* ADD: Timestamp */}
            <p className="text-violet-400 text-sm mt-2">
              Analysis Date: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Existing chakra cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {analysisResult.chakras.map((chakra, idx) => {
              const Icon = chakra.icon;
              return (
                <div
                  key={idx}
                  className="bg-black/40 backdrop-blur rounded-xl p-6 border border-violet-500/30"
                >
                  <div className={`${chakra.color} rounded-lg p-4 mb-4`}>
                    <div className="flex items-center gap-3 text-white">
                      <Icon size={32} />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{chakra.name}</h3>
                        <p className="text-white/90">{chakra.theme}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        chakra.state === 'balanced' ? 'bg-green-600' :
                        chakra.state === 'overactive' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {chakra.state.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="text-violet-300 font-semibold mb-2">Current Effects:</h4>
                      <ul className="text-gray-300 space-y-1">
                        {chakra.effects.map((effect, i) => (
                          <li key={i}>• {effect}</li>
                        ))}
                      </ul>
                    </div>

                    {chakra.sideEffects.length > 0 && (
                      <div>
                        <h4 className="text-orange-300 font-semibold mb-2">Side Effects:</h4>
                        <ul className="text-gray-300 space-y-1">
                          {chakra.sideEffects.map((effect, i) => (
                            <li key={i}>• {effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="text-green-300 font-semibold mb-2">Recommended Remedies:</h4>
                      <ul className="text-gray-300 space-y-1">
                        {chakra.remedies.map((remedy, i) => (
                          <li key={i}>• {remedy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ADD: Message Display for PDF generation feedback */}
        {message && (
          <div className="mb-6 bg-violet-900/50 border border-violet-500/50 rounded-lg p-4 text-white text-center backdrop-blur">
            {message}
          </div>
        )}

        {/* MODIFIED: Action Buttons - Add Download Button */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={downloadResultsAsPDF}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl 
              font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg
              flex items-center gap-2"
          >
            <Download size={24} />
            Download PDF
          </button>
          
          <button
            onClick={() => setCurrentScreen('simulator')}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl 
              font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg"
          >
            Try Stack Simulator
          </button>
          
          <button
            onClick={() => setCurrentScreen('healing')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl 
              font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            Begin Healing Journey
          </button>
        </div>
      </div>
    </div>
  );
}

  // Simulator Screen
  if (currentScreen === 'simulator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              Energy Stack Simulator
            </h1>
            <p className="text-violet-300 text-lg">Visualize emotional push and pop operations</p>
          </div>

          <div className="mb-6 bg-black/30 rounded-lg p-4 backdrop-blur">
            <div className="flex justify-between items-center mb-2">
              <span className="text-violet-300 font-semibold">Energy Level</span>
              <span className="text-white font-bold">{energy}%</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${energy > 60 ? 'bg-green-500' : energy > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${energy}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black/40 rounded-xl p-6 backdrop-blur border border-violet-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">Energy Centers</h2>
              <div className="space-y-3">
                {chakraData.map((chakra, index) => {
                  const Icon = chakra.icon;
                  const stackCount = stack.filter(i => i === index).length;
                  return (
                    <div key={index} className={`${chakra.color} rounded-lg p-4 cursor-pointer hover:scale-105 transition-all shadow-lg`}
                      onClick={() => pushEmotion(index)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="text-white" size={24} />
                          <div>
                            <h3 className="text-white font-bold">{chakra.name}</h3>
                            <p className="text-white/80 text-sm">{chakra.theme}</p>
                          </div>
                        </div>
                        {stackCount > 0 && (
                          <span className="bg-white/30 text-white px-3 py-1 rounded-full text-sm font-bold">×{stackCount}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black/40 rounded-xl p-6 backdrop-blur border border-violet-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Operations</h2>
                <div className="space-y-3">
                  <button onClick={popEmotion} disabled={stack.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    POP - Release Emotion
                  </button>
                  <button onClick={() => { setStack([]); setEnergy(50); }}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-violet-600 hover:to-purple-700 transition-all">
                    Reset Flow
                  </button>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-6 backdrop-blur border border-violet-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Stack State</h2>
                {stack.length === 0 ? (
                  <div className="text-violet-300 text-center py-8 italic">Stack is empty</div>
                ) : (
                  <div className="space-y-2">
                    {[...stack].reverse().map((idx, i) => (
                      <div key={i} className={`${chakraData[idx].color} rounded p-3 text-white`}>
                        #{stack.length - i} - {chakraData[idx].name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => setCurrentScreen('results')}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700">
              Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Healing Screen
  if (currentScreen === 'healing' && analysisResult) {
    const imbalancedChakras = analysisResult.chakras.filter(c => c.state !== 'balanced');
    const currentChakra = imbalancedChakras[currentRemedy % imbalancedChakras.length];
    
    if (!currentChakra) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-400 mb-4">🌟 All Chakras Balanced!</h2>
            <p className="text-violet-300 mb-8">Your energy system is in harmony</p>
            <button onClick={() => setCurrentScreen('results')}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-violet-600 hover:to-purple-700 transition-all">
              View Full Report
            </button>
          </div>
        </div>
      );
    }

    const Icon = currentChakra.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              Healing Journey
            </h1>
            <p className="text-violet-300 text-lg">
              Focus on {currentChakra.name} Chakra ({currentRemedy + 1} of {imbalancedChakras.length})
            </p>
          </div>

          <div className={`${currentChakra.color} rounded-2xl p-12 mb-8 shadow-2xl relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-pulse" />
            <div className="relative z-10 text-center text-white">
              <Icon className="mx-auto mb-6" size={80} />
              <h2 className="text-4xl font-bold mb-4">{currentChakra.name} Chakra</h2>
              <p className="text-2xl mb-2">{currentChakra.theme}</p>
              <p className="text-xl opacity-90">Element: {currentChakra.element}</p>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur rounded-2xl p-8 border border-violet-500/30 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Healing Practices</h3>
            <div className="space-y-6">
              {currentChakra.remedies.map((remedy, idx) => (
                <div key={idx} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${currentChakra.color} p-3 rounded-full`}>
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">Practice {idx + 1}</h4>
                      <p className="text-gray-300">{remedy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 backdrop-blur rounded-2xl p-8 border border-violet-400/30 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Affirmation</h3>
            <p className="text-2xl text-center text-violet-200 italic font-light leading-relaxed">
              "I am grounded, balanced, and connected to my {currentChakra.theme.toLowerCase()}. 
              Energy flows freely through my {currentChakra.name} chakra."
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentRemedy(Math.max(0, currentRemedy - 1))}
              disabled={currentRemedy === 0}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold 
                hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="inline mr-2" size={20} />
              Previous
            </button>
            
            <button
              onClick={() => setCurrentScreen('results')}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
            >
              View Results
            </button>

            <button
              onClick={() => setCurrentRemedy(currentRemedy + 1)}
              disabled={currentRemedy >= imbalancedChakras.length - 1}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg 
                font-semibold hover:from-violet-600 hover:to-purple-700 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="inline ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }



  return null;
};


export default ChakraStackSimulatorFull;