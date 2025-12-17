import google.generativeai as genai
from config import Config
import json
import logging

logger = logging.getLogger(__name__)

class GeminiClient:
    """Wrapper for Google Gemini API interactions"""
    
    def __init__(self):
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_chakra(self, chakra_name, responses, chakra_info):
        """
        Analyze a single chakra based on user responses
        
        Args:
            chakra_name (str): Name of the chakra
            responses (list): List of 5 responses (1-5 scale)
            chakra_info (dict): Additional chakra metadata
        
        Returns:
            dict: Analysis results with state, effects, side_effects, remedies
        """
        avg_score = sum(responses) / len(responses)
        
        prompt = f"""
You are an expert in energy healing and chakra analysis. Analyze the following chakra based on user responses.

Chakra: {chakra_name}
Theme: {chakra_info['theme']}
Element: {chakra_info['element']}
Average Score: {avg_score:.2f} (out of 5)
Individual Responses: {responses}

Based on this data:
1. Determine the chakra state (balanced, overactive, or underactive):
   - Score >= 4.0: overactive
   - Score 2.5-3.9: balanced
   - Score < 2.5: underactive

2. Provide 3 specific effects this state has on the person's life
3. If imbalanced, provide 3 potential side effects if left unaddressed
4. Provide 3 specific, actionable remedies or practices

Return your analysis in this exact JSON format:
{{
  "state": "balanced|overactive|underactive",
  "effects": ["effect 1", "effect 2", "effect 3"],
  "side_effects": ["side effect 1", "side effect 2", "side effect 3"],
  "remedies": ["remedy 1", "remedy 2", "remedy 3"],
  "affirmation": "A personalized affirmation for this chakra"
}}

Be specific, compassionate, and practical in your recommendations.
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text
            
            # Extract JSON from response
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            result = json.loads(result_text.strip())
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing chakra {chakra_name}: {str(e)}")
            # Return fallback analysis
            return self._fallback_analysis(chakra_name, avg_score)
    
    def _fallback_analysis(self, chakra_name, avg_score):
        """Fallback analysis if API fails"""
        if avg_score >= 4.0:
            state = "overactive"
        elif avg_score >= 2.5:
            state = "balanced"
        else:
            state = "underactive"
        
        return {
            "state": state,
            "effects": [
                f"Your {chakra_name} chakra shows {state} energy patterns",
                "This influences your daily emotional and physical state",
                "Energy flow in this center needs attention"
            ],
            "side_effects": [
                "Potential energy imbalances",
                "Compensatory patterns in other chakras",
                "Reduced overall wellbeing"
            ] if state != "balanced" else [],
            "remedies": [
                f"Practice {chakra_name} chakra meditation",
                "Engage in balancing physical activities",
                "Work with a holistic practitioner"
            ],
            "affirmation": f"I am balanced and centered in my {chakra_name} chakra"
        }
    
    def generate_overall_summary(self, chakra_results):
        """Generate an overall summary of all chakras"""
        prompt = f"""
Based on the following chakra analysis results, provide a brief overall summary (2-3 sentences) 
of the person's energy state and general recommendations.

Chakra States:
{json.dumps(chakra_results, indent=2)}

Focus on the overall pattern and most important areas for growth.
"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return "Your energy centers show a unique pattern. Focus on the imbalanced areas with the recommended practices."