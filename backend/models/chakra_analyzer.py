import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.gemini_client import GeminiClient
import logging

logger = logging.getLogger(__name__)

class ChakraAnalyzer:
    """Main analyzer for processing chakra questionnaire responses"""
    
    CHAKRA_DATA = [
        {
            "name": "Root",
            "theme": "Security & Grounding",
            "element": "Earth",
            "color": "Red"
        },
        {
            "name": "Sacral",
            "theme": "Creativity & Pleasure",
            "element": "Water",
            "color": "Orange"
        },
        {
            "name": "Solar Plexus",
            "theme": "Confidence & Power",
            "element": "Fire",
            "color": "Yellow"
        },
        {
            "name": "Heart",
            "theme": "Love & Compassion",
            "element": "Air",
            "color": "Green"
        },
        {
            "name": "Throat",
            "theme": "Communication & Truth",
            "element": "Sound",
            "color": "Blue"
        },
        {
            "name": "Third Eye",
            "theme": "Intuition & Insight",
            "element": "Light",
            "color": "Indigo"
        },
        {
            "name": "Crown",
            "theme": "Spiritual Connection",
            "element": "Consciousness",
            "color": "Violet"
        }
    ]
    
    def __init__(self):
        try:
            self.gemini_client = GeminiClient()
        except Exception as e:
            logger.warning(f"Could not initialize Gemini client: {e}")
            self.gemini_client = None
    
    def analyze_responses(self, answers):
        """
        Analyze all 35 questionnaire responses
        
        Args:
            answers (dict): Dictionary with question indices (0-34) as keys, responses (1-5) as values
        
        Returns:
            dict: Complete analysis results
        """
        # Group responses by chakra (5 questions each)
        chakra_responses = self._group_by_chakra(answers)
        
        # Analyze each chakra
        results = []
        for idx, chakra_info in enumerate(self.CHAKRA_DATA):
            responses = chakra_responses.get(idx, [3, 3, 3, 3, 3])  # Default to neutral
            
            logger.info(f"Analyzing {chakra_info['name']} chakra...")
            
            if self.gemini_client:
                try:
                    analysis = self.gemini_client.analyze_chakra(
                        chakra_info['name'],
                        responses,
                        chakra_info
                    )
                except Exception as e:
                    logger.error(f"Error with Gemini analysis: {e}")
                    analysis = self._fallback_analysis(chakra_info['name'], responses)
            else:
                analysis = self._fallback_analysis(chakra_info['name'], responses)
            
            results.append({
                **chakra_info,
                **analysis,
                "score": sum(responses) / len(responses)
            })
        
        # Calculate overall balance
        overall_score = sum(r['score'] for r in results) / len(results)
        
        # Generate summary
        if self.gemini_client:
            try:
                summary = self.gemini_client.generate_overall_summary(results)
            except:
                summary = "Your energy centers show a unique pattern. Focus on the imbalanced areas with the recommended practices."
        else:
            summary = "Your energy centers show a unique pattern. Focus on the imbalanced areas with the recommended practices."
        
        return {
            "chakras": results,
            "overall_balance": overall_score,
            "overall_summary": summary,
            "total_questions_answered": len(answers)
        }
    
    def _group_by_chakra(self, answers):
        """Group 35 answers into 7 chakras (5 questions each)"""
        chakra_responses = {}
        
        for question_idx, response in answers.items():
            question_idx = int(question_idx)
            chakra_idx = question_idx // 5  # 0-4 -> 0, 5-9 -> 1, etc.
            
            if chakra_idx not in chakra_responses:
                chakra_responses[chakra_idx] = []
            
            chakra_responses[chakra_idx].append(response)
        
        return chakra_responses
    
    def _fallback_analysis(self, chakra_name, responses):
        """Fallback analysis when Gemini is unavailable"""
        avg_score = sum(responses) / len(responses)
        
        if avg_score >= 4.0:
            state = "overactive"
            effects = [
                f"High energy flow in {chakra_name} chakra",
                "This center is very active in your daily life",
                "May be compensating for other areas"
            ]
            side_effects = [
                "Potential energy burnout",
                "Imbalance with other chakras",
                "Need for grounding and rest"
            ]
            remedies = [
                f"Practice calming exercises for {chakra_name}",
                "Balance with complementary chakra work",
                "Focus on grounding and centering"
            ]
        elif avg_score >= 2.5:
            state = "balanced"
            effects = [
                f"Healthy energy flow in {chakra_name} chakra",
                "This center is well-balanced",
                "Good foundation for continued growth"
            ]
            side_effects = []
            remedies = [
                f"Maintain your current practices for {chakra_name}",
                "Continue supporting this balanced state",
                "Use this strength to support other areas"
            ]
        else:
            state = "underactive"
            effects = [
                f"Limited energy flow in {chakra_name} chakra",
                "This center needs more attention",
                "May be affecting related life areas"
            ]
            side_effects = [
                "Energy blocks in this area",
                "Difficulty accessing this center",
                "Compensation through other chakras"
            ]
            remedies = [
                f"Practice activation exercises for {chakra_name}",
                "Focus meditation on this energy center",
                "Incorporate supportive daily practices"
            ]
        
        return {
            "state": state,
            "effects": effects,
            "side_effects": side_effects,
            "remedies": remedies,
            "affirmation": f"I am balanced and centered in my {chakra_name} chakra"
        }