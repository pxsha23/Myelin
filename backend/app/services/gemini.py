


# from google import genai
# from google.genai import errors as genai_errors
# from app.config import GEMINI_API_KEY

# client = genai.Client(api_key=GEMINI_API_KEY)

# BRAINSTORM_PROMPT = """You are Myelin, an AI second brain assistant.
# The user has a node called "{label}" of type {type}.
# Description: {description}

# Generate 5 specific, actionable ideas to expand this node.
# Be concrete. Keep each idea to 1-2 sentences. Numbered list."""

# IMPROVE_PROMPT = """You are Myelin, an AI second brain assistant.
# The user has a node called "{label}" of type {type}.
# Description: {description}

# Give 3 specific improvements or next steps for this node.
# Be critical and actionable. Numbered list."""

# CHAT_PROMPT = """You are Myelin, an AI second brain assistant.
# You have access to the user's brain — their nodes, projects, ideas, and goals.

# User's nodes:
# {nodes_context}

# Current mood: {mood}

# Answer based on their actual nodes. Be concise, max 3 sentences."""

# async def brainstorm_node(label: str, type: str, description: str = "") -> str:
#     try:
#         prompt = BRAINSTORM_PROMPT.format(
#             label=label, type=type,
#             description=description or "No description"
#         )
#         response = client.models.generate_content(
#             model="gemini-2.5-flash-lite",
#             contents=prompt
#         )
#         return response.text
#     except genai_errors.ClientError as e:
#         if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
#             return "Gemini quota exceeded. Please wait a minute and try again, or check your API key at aistudio.google.com."
#         return f"AI error: {str(e)}"
#     except Exception as e:
#         return f"AI unavailable: {str(e)}"

# async def improve_node(label: str, type: str, description: str = "") -> str:
#     try:
#         prompt = IMPROVE_PROMPT.format(
#             label=label, type=type,
#             description=description or "No description"
#         )
#         response = client.models.generate_content(
#             model="gemini-2.5-flash-lite",
#             contents=prompt
#         )
#         return response.text
#     except genai_errors.ClientError as e:
#         if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
#             return "Gemini quota exceeded. Please wait a minute and try again."
#         return f"AI error: {str(e)}"
#     except Exception as e:
#         return f"AI unavailable: {str(e)}"

# async def chat_with_brain(message: str, nodes: list, mood: str) -> str:
#     try:
#         nodes_context = "\n".join([
#             f"- {n['label']} ({n['type']}): {n.get('description', 'no description')}"
#             for n in nodes
#         ]) or "No nodes yet"

#         prompt = f"{CHAT_PROMPT.format(nodes_context=nodes_context, mood=mood)}\n\nUser: {message}\nMyelin:"
#         response = client.models.generate_content(
#             model="gemini-2.5-flash-lite",
#             contents=prompt
#         )
#         return response.text
#     except genai_errors.ClientError as e:
#         if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
#             return "Gemini quota exceeded. Get a new API key at aistudio.google.com/apikey — free tier gives 1500 requests/day."
#         return f"AI error: {str(e)}"
#     except Exception as e:
#         return f"AI unavailable: {str(e)}"








from google import genai
from google.genai import errors as genai_errors
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

BRAINSTORM_PROMPT = """You are Myelin, an AI second brain assistant.
The user has a node called "{label}" of type {type}.
Description: {description}

Generate 5 specific, actionable ideas to expand this node.
Be concrete. Keep each idea to 1-2 sentences. Numbered list."""

IMPROVE_PROMPT = """You are Myelin, an AI second brain assistant.
The user has a node called "{label}" of type {type}.
Description: {description}

Give 3 specific improvements or next steps for this node.
Be critical and actionable. Numbered list."""

CHAT_PROMPT = """You are Myelin, an AI second brain assistant.
You have access to the user's brain — their nodes, projects, ideas, and goals.

User's nodes:
{nodes_context}

Current mood: {mood}

Answer based on their actual nodes. Be concise, max 3 sentences."""

async def brainstorm_node(label: str, type: str, description: str = "") -> str:
    try:
        prompt = BRAINSTORM_PROMPT.format(
            label=label, type=type,
            description=description or "No description"
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",  # fixed
            contents=prompt
        )
        return response.text
    except genai_errors.ClientError as e:
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            return "Gemini quota exceeded. Please wait a minute and try again, or check your API key at aistudio.google.com."
        return f"AI error: {str(e)}"
    except Exception as e:
        return f"AI unavailable: {str(e)}"

async def improve_node(label: str, type: str, description: str = "") -> str:
    try:
        prompt = IMPROVE_PROMPT.format(
            label=label, type=type,
            description=description or "No description"
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",  # fixed
            contents=prompt
        )
        return response.text
    except genai_errors.ClientError as e:
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            return "Gemini quota exceeded. Please wait a minute and try again."
        return f"AI error: {str(e)}"
    except Exception as e:
        return f"AI unavailable: {str(e)}"

async def chat_with_brain(message: str, nodes: list, mood: str) -> str:
    try:
        nodes_context = "\n".join([
            f"- {n['label']} ({n['type']}): {n.get('description', 'no description')}"
            for n in nodes
        ]) or "No nodes yet"

        prompt = f"{CHAT_PROMPT.format(nodes_context=nodes_context, mood=mood)}\n\nUser: {message}\nMyelin:"
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",  # fixed
            contents=prompt
        )
        return response.text
    except genai_errors.ClientError as e:
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            return "Gemini quota exceeded. Get a new API key at aistudio.google.com/apikey — free tier gives 1500 requests/day."
        return f"AI error: {str(e)}"
    except Exception as e:
        return f"AI unavailable: {str(e)}"