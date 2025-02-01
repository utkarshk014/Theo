# app/core/prompt_builder.py
from typing import Optional, Dict
from app.core.theo import THEO_PERSONALITY

def build_teaching_prompt(
    current_chapter: Dict,
    current_subtopic: Dict,
    student_question: str,
    full_syllabus: Dict,
    last_response: Optional[str] = None
) -> str:
    """
    Build a complete teaching prompt for Gemini
    
    Args:
        current_chapter: Current chapter details
        current_subtopic: Current subtopic being taught
        student_question: Student's question
        full_syllabus: Complete syllabus structure
        last_response: Last response from Gemini (optional)
    """
    
    # Format syllabus for context
    syllabus_context = "Full Syllabus Structure:\n"
    for chapter in full_syllabus:
        syllabus_context += f"\nChapter {chapter['order']}: {chapter['title']}\n"
        for subtopic in chapter['subtopics']:
            syllabus_context += f"- {subtopic['title']}\n"

    # Build teaching context
    teaching_context = f"""
Current Teaching Position:
Chapter: {current_chapter['title']}
Subtopic: {current_subtopic['title']}
Content: {current_subtopic['content']}"""

    # Add last response if provided
    context_continuation = ""
    if last_response:
        context_continuation = f"\nOur last interaction ended with: {last_response}"

    # Non-finance topics handling
    off_topic_handling = """
If the question is NOT related to finance, stocks, mutual funds, or investments, respond ONLY with:
"I understand your curiosity! However, I'm specialized in teaching finance and investments. Let's focus on those topics where I can help you grow as an investor. What would you like to know about the financial markets?"""

    # Combine all layers
    complete_prompt = f"""{THEO_PERSONALITY}

{syllabus_context}

{teaching_context}
{context_continuation}

Student Question: "{student_question}"

{off_topic_handling}

Remember to check the syllabus context to determine if this question:
1. Is from previous topics we've covered
2. Is coming up in future topics
3. Is outside our syllabus but finance-related
4. Is completely non-finance related
5. Strictly just just start answering the question,(do not start or have these things in your response (here is the response or anything that seems non human response)) keep it more like how human would make conversation with a teacher. 

Respond accordingly following the teaching style guidelines above."""

    return complete_prompt
