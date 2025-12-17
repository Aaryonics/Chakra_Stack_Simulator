from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Enable CORS
CORS(app, origins=['http://localhost:3000'])

# Chakra data
CHAKRA_DATA = [
    {"name": "Root", "theme": "Security & Grounding", "element": "Earth", "color": "Red"},
    {"name": "Sacral", "theme": "Creativity & Pleasure", "element": "Water", "color": "Orange"},
    {"name": "Solar Plexus", "theme": "Confidence & Power", "element": "Fire", "color": "Yellow"},
    {"name": "Heart", "theme": "Love & Compassion", "element": "Air", "color": "Green"},
    {"name": "Throat", "theme": "Communication & Truth", "element": "Sound", "color": "Blue"},
    {"name": "Third Eye", "theme": "Intuition & Insight", "element": "Light", "color": "Indigo"},
    {"name": "Crown", "theme": "Spiritual Connection", "element": "Consciousness", "color": "Violet"}
]

QUESTIONS = [
    # Root Chakra (0-4)
    {"chakra": 0, "text": "How secure do you feel about your financial situation?", "type": "scale"},
    {"chakra": 0, "text": "Do you feel safe and stable in your living environment?", "type": "scale"},
    {"chakra": 0, "text": "How connected do you feel to your physical body?", "type": "scale"},
    {"chakra": 0, "text": "Do you trust that your basic needs will be met?", "type": "scale"},
    {"chakra": 0, "text": "How grounded do you feel in your daily life?", "type": "scale"},
    
    # Sacral Chakra (5-9)
    {"chakra": 1, "text": "How comfortable are you expressing your emotions?", "type": "scale"},
    {"chakra": 1, "text": "Do you allow yourself to experience pleasure and joy?", "type": "scale"},
    {"chakra": 1, "text": "How creative do you feel in your daily activities?", "type": "scale"},
    {"chakra": 1, "text": "Are you comfortable with intimacy and connection?", "type": "scale"},
    {"chakra": 1, "text": "How well do you adapt to change?", "type": "scale"},
    
    # Solar Plexus (10-14)
    {"chakra": 2, "text": "How confident do you feel in your abilities?", "type": "scale"},
    {"chakra": 2, "text": "Do you feel in control of your life direction?", "type": "scale"},
    {"chakra": 2, "text": "How comfortable are you making decisions?", "type": "scale"},
    {"chakra": 2, "text": "Do you assert your boundaries with others?", "type": "scale"},
    {"chakra": 2, "text": "How motivated do you feel to pursue your goals?", "type": "scale"},
    
    # Heart Chakra (15-19)
    {"chakra": 3, "text": "How easily do you give and receive love?", "type": "scale"},
    {"chakra": 3, "text": "Do you practice self-compassion regularly?", "type": "scale"},
    {"chakra": 3, "text": "How forgiving are you towards yourself and others?", "type": "scale"},
    {"chakra": 3, "text": "Do you feel connected to those around you?", "type": "scale"},
    {"chakra": 3, "text": "How open is your heart to new relationships?", "type": "scale"},
    
    # Throat Chakra (20-24)
    {"chakra": 4, "text": "How comfortably do you express your truth?", "type": "scale"},
    {"chakra": 4, "text": "Do you feel heard and understood by others?", "type": "scale"},
    {"chakra": 4, "text": "How authentic are you in your communication?", "type": "scale"},
    {"chakra": 4, "text": "Do you speak up when something bothers you?", "type": "scale"},
    {"chakra": 4, "text": "How well do you listen to others?", "type": "scale"},
    
    # Third Eye (25-29)
    {"chakra": 5, "text": "How much do you trust your intuition?", "type": "scale"},
    {"chakra": 5, "text": "Do you have clarity about your life purpose?", "type": "scale"},
    {"chakra": 5, "text": "How vivid is your imagination and visualization?", "type": "scale"},
    {"chakra": 5, "text": "Do you experience meaningful insights or dreams?", "type": "scale"},
    {"chakra": 5, "text": "How connected are you to your inner wisdom?", "type": "scale"},
    
    # Crown Chakra (30-34)
    {"chakra": 6, "text": "How connected do you feel to something greater than yourself?", "type": "scale"},
    {"chakra": 6, "text": "Do you experience moments of spiritual awareness?", "type": "scale"},
    {"chakra": 6, "text": "How much meaning and purpose do you find in life?", "type": "scale"},
    {"chakra": 6, "text": "Do you practice mindfulness or meditation?", "type": "scale"},
    {"chakra": 6, "text": "How open are you to spiritual growth?", "type": "scale"}
]

def analyze_chakra_simple(chakra_name, responses, chakra_info):
    """Simple chakra analysis without AI"""
    avg_score = sum(responses) / len(responses)
    
    if avg_score >= 4.0:
        state = "overactive"
        effects = [
            f"High energy flow in {chakra_name} chakra",
            f"Strong {chakra_info['theme'].lower()} presence",
            "This center dominates your energy field"
        ]
        side_effects = [
            "Potential energy burnout in this area",
            "May overshadow other chakras",
            "Need for balance and grounding"
        ]
        remedies = [
            f"Practice calming exercises for {chakra_name}",
            "Balance with complementary chakra work",
            "Focus on grounding techniques"
        ]
    elif avg_score >= 2.5:
        state = "balanced"
        effects = [
            f"Healthy {chakra_info['theme'].lower()}",
            f"Good {chakra_info['element'].lower()} energy flow",
            "This center is well-balanced"
        ]
        side_effects = []
        remedies = [
            f"Maintain current {chakra_name} practices",
            "Continue nurturing this balance",
            "Use this strength to support other areas"
        ]
    else:
        state = "underactive"
        effects = [
            f"Limited {chakra_info['theme'].lower()}",
            f"Blocked {chakra_info['element'].lower()} energy",
            "This center needs activation"
        ]
        side_effects = [
            "Energy blocks in this area",
            "Compensating through other chakras",
            "Missing growth opportunities"
        ]
        remedies = [
            f"Practice {chakra_name} activation exercises",
            f"Meditate on {chakra_info['theme'].lower()}",
            f"Incorporate {chakra_info['element'].lower()} elements daily"
        ]
    
    return {
        "state": state,
        "effects": effects,
        "side_effects": side_effects,
        "remedies": remedies,
        "affirmation": f"I am balanced and centered in my {chakra_name} chakra"
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/questions', methods=['GET'])
def get_questions():
    return jsonify({"questions": QUESTIONS, "total": len(QUESTIONS)})

@app.route('/api/analyze', methods=['POST'])
def analyze_chakras():
    try:
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify({"error": "Missing 'answers' in request body"}), 400
        
        answers = data['answers']
        
        # Group responses by chakra
        chakra_responses = {}
        for question_idx, response in answers.items():
            question_idx = int(question_idx)
            chakra_idx = question_idx // 5
            
            if chakra_idx not in chakra_responses:
                chakra_responses[chakra_idx] = []
            
            chakra_responses[chakra_idx].append(response)
        
        # Analyze each chakra
        results = []
        for idx, chakra_info in enumerate(CHAKRA_DATA):
            responses = chakra_responses.get(idx, [3, 3, 3, 3, 3])
            analysis = analyze_chakra_simple(chakra_info['name'], responses, chakra_info)
            
            results.append({
                **chakra_info,
                **analysis,
                "score": sum(responses) / len(responses)
            })
        
        overall_score = sum(r['score'] for r in results) / len(results)
        
        return jsonify({
            "success": True,
            "results": {
                "chakras": results,
                "overall_balance": overall_score,
                "overall_summary": "Your chakra analysis is complete. Focus on the areas that need attention.",
                "total_questions_answered": len(answers)
            }
        })
        
    except Exception as e:
        logger.error(f"Error in analysis: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Chakra Stack Simulator API on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)